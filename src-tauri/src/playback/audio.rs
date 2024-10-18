use std::{fs::File, path::Path, sync::{atomic::AtomicU32, mpsc::Receiver, Arc}, thread, time::Duration};

use atomic_wait::wake_all;
use cpal::traits::DeviceTrait;
use symphonia::{core::{audio::SignalSpec, codecs::{DecoderOptions, CODEC_TYPE_NULL}, errors::Error::ResetRequired, formats::{FormatOptions, SeekTo, Track}, io::MediaSourceStream, meta::MetadataOptions, probe::Hint, units::Time}, default::get_probe};
use tauri::{async_runtime::Mutex, AppHandle, Emitter};
use tokio_util::sync::CancellationToken;

// use crate::logger;

use super::{output::{self, get_device_by_name, AudioOutput, AudioOutputError}, types::{PlayerEvent, SampleOffsetEvent, VolumeEvent, ACTIVE, PAUSED}};


fn log(_app_handle: &AppHandle, msg: &str, _level: usize) {
  println!("{}", msg);
}

/// Starts audio playback.
pub fn start_audio(
  decoding_active: &Arc<AtomicU32>,
  player_receiver: &Arc<Mutex<Receiver<PlayerEvent>>>,
  volume_receiver: &Arc<Mutex<Receiver<VolumeEvent>>>,
  app_handle: &AppHandle
) {
  let decoding_active = decoding_active.clone();
  decoding_active.store(ACTIVE, std::sync::atomic::Ordering::Relaxed);

  wake_all(decoding_active.as_ref());

  decode_loop(&decoding_active, player_receiver, volume_receiver, app_handle);
}

/// Handles decoding the current track.
fn decode_loop(
  decoding_active: &Arc<AtomicU32>,
  player_receiver: &Arc<Mutex<Receiver<PlayerEvent>>>,
  volume_receiver: &Arc<Mutex<Receiver<VolumeEvent>>>,
  app_handle: &AppHandle
) {
  println!("starting decode loop...");
  // * These will be reset when changing tracks
  let mut path_str: Option<String> = None;
  let mut path_str_clone: Option<String>;
  let mut seek = None;
  let mut volume = None;
  let mut audio_device_name = None;
  let mut previous_audio_device_name: String = String::new();
  let mut timestamp: f64 = 0.0;
  let mut previous_sample_rate = 44100;
  let mut previous_channels = 2;

  let (playback_state_sender, playback_state_receiver) = std::sync::mpsc::channel();
  let (reset_control_sender, reset_control_receiver) = std::sync::mpsc::channel();
  let (device_change_sender, device_change_receiver) = std::sync::mpsc::channel();
  let (sender_sample_offset, receiver_sample_offset) = std::sync::mpsc::channel();
  let sample_offset_receiver = Arc::new(Mutex::new(receiver_sample_offset));
  let (timestamp_sender, timestamp_receiver) = std::sync::mpsc::channel();
  let timestamp_send = Arc::new(Mutex::new(timestamp_sender));
  let playback_state = Arc::new(Mutex::new(playback_state_receiver));
  let reset_control = Arc::new(Mutex::new(reset_control_receiver));
  let device_change = Arc::new(Mutex::new(device_change_receiver));

  let mut audio_output: Option<Result<Arc<Mutex<dyn AudioOutput>>, AudioOutputError>> = None;

  let mut cancel_token;

  let mut is_reset = true;

  // Loop here!
  loop {
    cancel_token = CancellationToken::new();
    
    path_str_clone = path_str.clone();
    if let None = path_str {
      let event = player_receiver.try_lock().unwrap().recv();

      if let Ok(result) = event {
        match result {
          PlayerEvent::LoadFile(event) => {
            log(app_handle, "loading new file...", 0);

            path_str.replace(event.file_path);
            seek.replace(event.position.unwrap());
            volume.replace(event.volume.unwrap());
          }
          PlayerEvent::SetAudioDevice(device_name) => {
            log(app_handle, "changing audio device", 0);

            audio_device_name = device_name;
            if path_str_clone.is_some() && path_str.is_some() {
              path_str.replace(path_str_clone.clone().unwrap());
            }

            cancel_token.cancel();
            is_reset = true;
          }
          PlayerEvent::Seek(_position) => {

          }
        }
      }
    } else if let Some(ref p) = path_str.clone() {
      let path = Path::new(p.as_str());

      let mut hint = Hint::new();
      let source = Box::new(File::open(path).unwrap());

      if let Some(extension) = path.extension() {
        if let Some(extension_str) = extension.to_str() {
          hint.with_extension(extension_str);
        }
      }

      // Create the media source stream using the boxed media source from above.
      let mss = MediaSourceStream::new(source, Default::default());

      // Use the default options for format readers other than for gapless playback.
      let format_opts = FormatOptions {
        enable_gapless: true,
        ..Default::default()
      };

      // Use the default options for metadata readers.
      let metadata_opts: MetadataOptions = MetadataOptions {
        limit_metadata_bytes: symphonia::core::meta::Limit::Maximum(50),
        limit_visual_bytes: symphonia::core::meta::Limit::Maximum(0),
      };

      let probe_result = get_probe().format(&hint, mss, &format_opts, &metadata_opts);

      if probe_result.is_err() {
        println!("probe_result err: {}", probe_result.err().unwrap());
        path_str = None;
        continue;
      }

      path_str = None;

      let mut reader = probe_result.unwrap().format;

      let track = reader.default_track().unwrap().clone();

      let mut track_id = track.id;

      // If seeking, seek the reader to the time or timestamp specified and get the timestamp of the
      // seeked position. All packets with a timestamp < the seeked position will not be played.
      //
      // Note: This is a half-baked approach to seeking! After seeking the reader, packets should be
      // decoded and *samples* discarded up-to the exact *sample* indicated by required_ts. The
      // current approach will discard excess samples if seeking to a sample within a packet.
      let seek_ts = if let Some(sk) = seek {
        let seek_to = SeekTo::Time {
          time: Time::from(sk),
          track_id: Some(track_id),
        };

        // Attempt the seek. If the seek fails, ignore the error and return a seek timestamp of 0 so
        // that no samples are trimmed.
        match reader.seek(symphonia::core::formats::SeekMode::Accurate, seek_to) {
          Ok(seeked_to) => seeked_to.required_ts,
          Err(ResetRequired) => {
            track_id = first_supported_track(reader.tracks()).unwrap().id;
            0
          }
          Err(_err) => {
            // Don't give-up on a seek error.
            0
          }
        }
      } else {
        // If not seeking, the seek timestamp is 0.
        0
      };

      // Create a decoder for the track.
      let mut decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &DecoderOptions { verify: false })
        .unwrap();

      let spec = SignalSpec {
        rate: decoder.codec_params().sample_rate.unwrap(),
        channels: decoder.codec_params().channels.unwrap(),
      };

      let mut should_reset_audio = false;
      let mut new_max_frames = 1152;
      let mut max_frames_changed = false;

      let max_frames = decoder.codec_params().max_frames_per_packet;
      if let Some(dur) = max_frames {
        if dur != new_max_frames {
          max_frames_changed = true;
        }

        new_max_frames = dur;
      }

      let output_device = get_device_by_name(audio_device_name.clone());

      let device_name = output_device.clone().unwrap().name().unwrap();
      // If we have a default audio device (we always should, but just in case)
      // we check if the track spec differs from the output device
      // if it does - resample the decoded audio using Symphonia.

      // Check if track sample rate differs from current OS config
      if let Some(mut device) = output_device {
          // Only resample when audio device doesn't support file sample rate
          // so we can't switch the device rate to match.
          // info!(
          //     "cpal: device default config {:?}",
          //     device.default_output_config()
          // );
          let supported_output_configs = device.supported_output_configs();
          let mut supports_sample_rate = false;
          if let Ok(mut output_configs) = supported_output_configs {
            supports_sample_rate = output_configs
              .find(|c| {
                return c.try_with_sample_rate(cpal::SampleRate(spec.rate)).is_some();
              })
              .is_some();
          } else if supported_output_configs.is_err() {
            device = get_device_by_name(None).unwrap();
          }

          // If sample rate or channels changed - reinit the audio device with the new spec
          // (if this sample rate isn't supported, it will be resampled)
          should_reset_audio = previous_audio_device_name != device.name().unwrap()
            || supports_sample_rate && spec.rate != previous_sample_rate
            || spec.channels.count() != previous_channels
            || max_frames_changed;
      }

      previous_sample_rate = spec.rate;
      previous_channels = spec.channels.count();
      previous_audio_device_name = device_name.clone();

      // println!("seek was ok");
      if audio_output.is_none() || should_reset_audio {
        // Try to open the audio output.

        if should_reset_audio {
          if let Some(output) = audio_output {
            if let Ok(out) = output {
              if let Ok(mut guard) = out.try_lock() {
                guard.flush();
                guard.pause();
                guard.stop_stream();
              }
            }
          }
        }
        
        println!("opening audio output...");
        audio_output = Some(output::try_open(
          &previous_audio_device_name,
          spec,
          new_max_frames,
          volume_receiver.clone(),
          sample_offset_receiver.clone(),
          playback_state.clone(),
          reset_control.clone(),
          device_change.clone(),
          timestamp_send.clone(),
          volume.clone(),
          app_handle.clone(),
        ));
      } else {
        log(app_handle, "player: Re-using existing audio output", 0);
      }

      let clone_device_name = device_name.clone();
      let _ = reset_control_sender.send(true);
      let _ = device_change_sender.send(clone_device_name);
      let _ = sender_sample_offset.send(SampleOffsetEvent {
        sample_offset: Some(
          seek_ts * track.codec_params.channels.unwrap().count() as u64,
        ),
      });

      let receiver = player_receiver.try_lock().unwrap();

      if let Some(ref audio) = audio_output {
        if let Ok(ao) = audio {
          if let Ok(mut guard) = ao.try_lock() {
            // let mut transition_time = Instant::now();
            // let mut started_transition = false;

            // Resampling stuff
            guard.resume();
            guard.update_resampler(spec, new_max_frames);

            // Until all samples have been flushed - don't start decoding
            // Keep checking until all samples have been played (buffer is empty)
            if is_reset {
              while guard.has_remaining_samples() {
                guard.flush();
              }
            }

            // Decode all packets, ignoring all decode errors.
            let result = loop {
              if let Ok(ts) = timestamp_receiver.try_recv() {
                timestamp = ts;
              }
              let event = receiver.try_recv();
              
              if let Ok(result) = event {
                match result {
                  PlayerEvent::LoadFile(event) => {
                    log(app_handle, "loading new file...", 0);
                    path_str.replace(event.file_path);
                    seek.replace(event.position.unwrap());
                    volume.replace(event.volume.unwrap());
                    cancel_token.cancel();
                    guard.flush();
                    is_reset = true;
                  }
                  PlayerEvent::SetAudioDevice(device_name) => {
                    log(app_handle, "changing audio device", 0);

                    audio_device_name = device_name;
                    path_str.replace(path_str_clone.clone().unwrap());
                    cancel_token.cancel();
                    guard.flush();
                    guard.pause();
                    seek.replace(timestamp); // Restore current seek position
                    is_reset = true;
                  }
                  PlayerEvent::Seek(position) => {
                    path_str.replace(path_str_clone.clone().unwrap());
                    seek.replace(position);
                    cancel_token.cancel();
                    guard.flush();
                    is_reset = true;
                  }
                }
              }

              let mut is_paused = false;
              if decoding_active.load(std::sync::atomic::Ordering::Relaxed) == PAUSED {
                is_paused = true;
                guard.pause();
                let _ = playback_state_sender.send(false);
                let _ = app_handle.emit("paused", {});
              }

              // waits while the value is PAUSED (0)
              atomic_wait::wait(&decoding_active, PAUSED);

              // By default we want to resume the output after un-pausing,
              // unless the audio device has changed, in which case this is just a
              // temporary trip round the loop until the new device is set, and we pause again
              // to restore the previous state

              let mut should_resume = true;

              if is_paused {
                let ctrl_event = receiver.try_recv();
                if let Ok(result) = ctrl_event {
                  match result {
                    PlayerEvent::LoadFile(event) => {
                      path_str.replace(event.file_path);
                      seek.replace(event.position.unwrap());
                      volume.replace(event.volume.unwrap());
                      cancel_token.cancel();
                      guard.flush();
                      is_reset = true;
                    }
                    PlayerEvent::SetAudioDevice(device_name) => {
                      log(app_handle, "changing audio device", 0);

                      audio_device_name = device_name;
                      path_str.replace(path_str_clone.clone().unwrap());
                      cancel_token.cancel();
                      guard.flush();
                      guard.pause();
                      seek.replace(timestamp); // Restore current seek position
                      is_reset = true;
                      if is_paused {
                        should_resume = false;
                        
                        // Restore pause state after device change
                        let _ = &decoding_active.store(
                          PAUSED,
                          std::sync::atomic::Ordering::Relaxed,
                        );

                        wake_all(decoding_active.as_ref());
                      }
                    }
                    PlayerEvent::Seek(position) => {
                      path_str.replace(path_str_clone.clone().unwrap());
                      seek.replace(position);
                      cancel_token.cancel();
                      guard.flush();
                      is_reset = true;
                    }
                  }
                }

                if should_resume {
                  guard.resume();
                }
              }

              if cancel_token.is_cancelled() {
                break Ok(());
              }

              let _ = playback_state_sender.send(true);
              let _ = app_handle.emit("playing", {});

              let packet = match reader.next_packet() {
                Ok(packet) => packet,
                Err(err) => break Err(err),
              };

              // If the packet does not belong to the selected track, skip over it.
              if packet.track_id() != track_id {
                continue;
              }

              // Decode the packet into audio samples.
              match decoder.decode(&packet) {
                Ok(mut _decoded) => {
                  /*
                  Write packet to audio ring buffer here
                  Because the audio playback uses the ringbuffer, we are effectively
                  "slowing down" decoding to allow the audio stream to read from the
                  buffer as it's playing.
                    */
                  if !cancel_token.is_cancelled() {
                    // Write the decoded audio samples to the audio output if the presentation timestamp
                    // for the packet is >= the seeked position (0 if not seeking).
                    if packet.ts() >= seek_ts {
                      let mut ramp_up_smpls = 0;
                      let mut ramp_down_smpls = 0;
                      
                      // Avoid clicks by ramping down and up quickly
                      if let Some(frames) = track.codec_params.n_frames {
                        if packet.ts >= frames - packet.dur {
                          ramp_down_smpls = packet.dur;
                        } else if packet.ts < packet.dur {
                          ramp_up_smpls = packet.dur;
                        }
                      }
                      guard.write(_decoded, ramp_up_smpls, ramp_down_smpls);
                    }
                  }

                  continue;
                }
                Err(symphonia::core::errors::Error::DecodeError(err)) => {
                  log(app_handle, &format!("decode error: {}", err), 2);
                }
                Err(err) => break Err(err),
              }
            };

            // Return if a fatal error occured.
            let _ = match result {
              Err(symphonia::core::errors::Error::IoError(err))
                if err.kind() == std::io::ErrorKind::UnexpectedEof && err.to_string() == "end of stream" => {
                  // Keep checking until all samples have been played (buffer is empty)
                  while guard.has_remaining_samples() {
                    thread::sleep(Duration::from_millis(500));
                  }
                  
                  guard.pause();
                  let _ = app_handle.emit("ended", Some(0.0f64));
                  
                  // Do not treat "end of stream" as a fatal error. It's the currently only way a
                  // format reader can indicate the media is complete.
                  Ok(())
                }
              _ => result,
            };
          }
        }
      }
    };
  }
}

/// Gets the first supported track in the media file.
fn first_supported_track(tracks: &[Track]) -> Option<&Track> {
  return tracks.iter().find(|t| t.codec_params.codec != CODEC_TYPE_NULL);
}