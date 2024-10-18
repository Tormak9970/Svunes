// Symphonia
// Copyright (c) 2019-2022 The Project Symphonia Developers.
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

//! Platform-dependant Audio Outputs

use std::{result, thread, time};
use std::sync::mpsc::{Receiver, Sender};

use ::cpal::traits::{DeviceTrait, HostTrait};
use ::cpal::{default_host, Device};
use tauri::async_runtime::Mutex;
use tauri::{AppHandle, Emitter};
use std::sync::Arc;

use symphonia::core::audio::{AudioBufferRef, SignalSpec};

use super::types::{AudioDevice, AudioDevices, SampleOffsetEvent, VolumeEvent};

pub trait AudioOutput {
    fn write(&mut self, decoded: AudioBufferRef<'_>, ramp_up_samples: u64, ramp_down_samples: u64);
    fn flush(&mut self);
    #[allow(dead_code)]
    fn get_sample_rate(&self) -> u32;
    fn pause(&self);
    fn resume(&self);
    fn stop_stream(&mut self);
    fn update_resampler(&mut self, spec: SignalSpec, max_frames: u64) -> bool;
    fn has_remaining_samples(&self) -> bool;
    fn ramp_down(&mut self, buffer: AudioBufferRef, num_samples: usize);
    fn ramp_up(&mut self, buffer: AudioBufferRef, num_samples: usize);
}

#[allow(dead_code)]
#[allow(clippy::enum_variant_names)]
#[derive(Debug)]
pub enum AudioOutputError {
    OpenStreamError,
    PlayStreamError,
    StreamClosedError,
}

pub type Result<T> = result::Result<T, AudioOutputError>;

mod cpal {
  use std::sync::mpsc::{Receiver, Sender};
  use std::sync::{Arc, RwLock};
  use std::time::Duration;

  use crate::playback::output::get_device_by_name;
  use crate::playback::types::{SampleOffsetEvent, VolumeEvent};
  use crate::playback::resampler::Resampler;

  use super::{AudioOutput, AudioOutputError, Result};

  use cpal::Sample;
  use symphonia::core::audio::{AudioBufferRef, Layout, RawSample, SampleBuffer, SignalSpec};
  use symphonia::core::conv::{ConvertibleSample, IntoSample};
  use symphonia::core::units::TimeBase;

  use cpal::traits::{DeviceTrait, StreamTrait};
  use rb::*;

  use tauri::{AppHandle, Emitter};
  use tauri::async_runtime::Mutex;

  pub struct CpalAudioOutput {}

  trait AudioOutputSample:
    cpal::Sample
    + cpal::SizedSample
    + ConvertibleSample
    + IntoSample<f32>
    + RawSample
    + std::marker::Send
    + 'static
  {
  }

  impl AudioOutputSample for f32 {}
  impl AudioOutputSample for i16 {}
  impl AudioOutputSample for u16 {}

  impl CpalAudioOutput {
      pub fn try_open(
          device_name: &String,
          spec: SignalSpec,
          sample_buf_size: u64,
          volume_control_receiver: Arc<Mutex<Receiver<VolumeEvent>>>,
          sample_offset_receiver: Arc<Mutex<Receiver<SampleOffsetEvent>>>,
          playback_state_receiver: Arc<Mutex<Receiver<bool>>>,
          reset_control_receiver: Arc<Mutex<Receiver<bool>>>,
          device_change_receiver: Arc<Mutex<Receiver<String>>>,
          timestamp_sender: Arc<Mutex<Sender<f64>>>,
          vol: Option<f64>,
          app_handle: AppHandle,
      ) -> Result<Arc<Mutex<dyn AudioOutput>>> {
          let device = get_device_by_name(Some(device_name.clone())).unwrap();

          let config = match device.default_output_config() {
              Ok(config) => config,
              Err(_err) => {
                  return Err(AudioOutputError::OpenStreamError);
              }
          };

          // Only resample when audio device doesn't support file sample rate
          // so we can't switch the device rate to match.
          let supports_sample_rate = device
              .supported_output_configs()
              .unwrap()
              .find(|c| {
                  return c
                      .try_with_sample_rate(cpal::SampleRate(spec.rate))
                      .is_some();
              })
              .is_some();

          let rate = if supports_sample_rate {
              spec.rate
          } else {
              config.sample_rate().0
          };

          let device_spec = SignalSpec::new_with_layout(
              rate,
              match spec.channels.count() {
                  1 => Layout::Mono,
                  2 => Layout::Stereo,
                  3 => Layout::TwoPointOne,
                  5 => Layout::FivePointOne,
                  _ => Layout::Stereo,
              },
          );

          // Prepare the sample buffer size based on the maximum number of frames per packet
          let duration = sample_buf_size;

          // Select proper playback routine based on sample format.
          match config.sample_format() {
              cpal::SampleFormat::F32 => CpalAudioOutputImpl::<f32>::try_open(
                  device_spec,
                  duration,
                  &device,
                  volume_control_receiver,
                  sample_offset_receiver,
                  playback_state_receiver,
                  reset_control_receiver,
                  device_change_receiver,
                  timestamp_sender,
                  |packet, volume| ((packet as f64) * volume) as f32,
                  vol,
                  app_handle,
              ),
              cpal::SampleFormat::I16 => CpalAudioOutputImpl::<i16>::try_open(
                  device_spec,
                  duration,
                  &device,
                  volume_control_receiver,
                  sample_offset_receiver,
                  playback_state_receiver,
                  reset_control_receiver,
                  device_change_receiver,
                  timestamp_sender,
                  |packet, volume| ((packet as f64) * volume) as i16,
                  vol,
                  app_handle,
              ),
              cpal::SampleFormat::U16 => CpalAudioOutputImpl::<u16>::try_open(
                  device_spec,
                  duration,
                  &device,
                  volume_control_receiver,
                  sample_offset_receiver,
                  playback_state_receiver,
                  reset_control_receiver,
                  device_change_receiver,
                  timestamp_sender,
                  |packet, volume| ((packet as f64) * volume) as u16,
                  vol,
                  app_handle,
              ),
              _ => CpalAudioOutputImpl::<f32>::try_open(
                  device_spec,
                  duration,
                  &device,
                  volume_control_receiver,
                  sample_offset_receiver,
                  playback_state_receiver,
                  reset_control_receiver,
                  device_change_receiver,
                  timestamp_sender,
                  |packet, volume| ((packet as f64) * volume) as f32,
                  vol,
                  app_handle,
              ),
          }
      }
  }

  #[allow(dead_code)]
  struct CpalAudioOutputImpl<T: AudioOutputSample>
  where
      T: AudioOutputSample + Send + Sync,
  {
      ring_buf: SpscRb<T>,
      ring_buf_producer: rb::Producer<T>,
      sample_buf: SampleBuffer<T>,
      stream: Option<cpal::Stream>,
      resampler: Option<Resampler<T>>,
      sample_rate: u32,
      name: String,
  }

  impl<T: AudioOutputSample + Send + Sync> CpalAudioOutputImpl<T> {
      pub fn try_open(
          spec: SignalSpec,
          duration: symphonia::core::units::Duration,
          device: &cpal::Device,
          volume_control_receiver: Arc<Mutex<Receiver<VolumeEvent>>>,
          sample_offset_receiver: Arc<Mutex<Receiver<SampleOffsetEvent>>>,
          playback_state_receiver: Arc<Mutex<Receiver<bool>>>,
          reset_control_receiver: Arc<Mutex<Receiver<bool>>>,
          device_change_receiver: Arc<Mutex<Receiver<String>>>,
          timestamp_sender: Arc<Mutex<Sender<f64>>>,
          volume_change: fn(T, f64) -> T,
          vol: Option<f64>,
          app_handle: AppHandle,
      ) -> Result<Arc<Mutex<dyn AudioOutput>>> {
          let num_channels = spec.channels.count();
          // Output audio stream config.
          let config = if cfg!(not(target_os = "windows")) {
              cpal::StreamConfig {
                  channels: num_channels as cpal::ChannelCount,
                  sample_rate: cpal::SampleRate(spec.rate),
                  buffer_size: cpal::BufferSize::Default,
              }
          } else {
              // Use the default config for Windows.
              device
                  .default_output_config()
                  .expect("Failed to get the default output config.")
                  .config()
          };

          let time_base = TimeBase {
              numer: 1,
              denom: config.sample_rate.0 * config.channels as u32,
          };

          // Create a ring buffer with a capacity
          let ring_len = ((5000 * config.sample_rate.0 as usize) / 1000) * num_channels;

          let ring_buf = SpscRb::new(ring_len);
          let (ring_buf_producer, ring_buf_consumer) = (ring_buf.producer(), ring_buf.consumer());
          
          // States
          let volume_state = Arc::new(RwLock::new(vol.unwrap()));
          let frame_idx_state = Arc::new(RwLock::new(0));
          let elapsed_time_state = Arc::new(RwLock::new(0));
          let playback_state = Arc::new(RwLock::new(true));
          let device_state = Arc::new(RwLock::new(
              device.name().unwrap_or(String::from("Unknown")),
          ));
          let device_name_state = Arc::new(RwLock::new(
              device.name().unwrap_or(String::from("Unknown")),
          ));

          let stream_result = device.build_output_stream(
              &config,
              move |data: &mut [T], _cb: &cpal::OutputCallbackInfo| {
                  // If the device changed, ignore callback
                  if let Ok(device_change) = device_change_receiver.try_lock() {
                      if let Ok(result) = device_change.try_recv() {
                          let mut dvc_state = device_state.write().unwrap();
                          *dvc_state = result;
                      }
                  }

                  if let Ok(dvc_state) = device_state.try_read() {
                      if *dvc_state != *device_name_state.try_read().unwrap() {
                          data.iter_mut().for_each(|s| *s = T::MID);
                          return;
                      }
                  }

                  // If file changed, reset
                  let reset = reset_control_receiver.try_lock();
                  if let Ok(reset_lock) = reset {
                      if let Ok(rst) = reset_lock.try_recv() {
                          if rst {
                              let mut frame_idx = frame_idx_state.write().unwrap();
                              *frame_idx = 0;
                              let mut elapsed_time = elapsed_time_state.write().unwrap();
                              *elapsed_time = 0;
                              let _ = app_handle.emit("timestamp", Some(0f64));
                          }
                      }
                  }

                  // Get volume
                  let volume = volume_control_receiver.try_lock();
                  if let Ok(volume_lock) = volume {
                      if let Ok(VolumeEvent::SetVolume(vol)) = volume_lock.try_recv() {
                          let mut current_volume = volume_state.write().unwrap();
                          *current_volume = vol;
                      }
                  }

                  let current_volume = { *volume_state.read().unwrap() };
                  // info!("Current volume: {:?}", current_volume);

                  let playing = playback_state_receiver.try_lock();
                  if let Ok(play_lock) = playing {
                      if let Ok(pl) = play_lock.try_recv() {
                          let mut current_playing = playback_state.write().unwrap();
                          *current_playing = pl;
                      }
                  }

                  // update duration if seconds changed
                  if let Ok(pl_state) = playback_state.try_read() {
                      if *pl_state {
                          // Write out as many samples as possible from the ring buffer to the audio
                          // output.
                          let written = ring_buf_consumer.read(data).unwrap_or(0);

                          let sample_offset = sample_offset_receiver.try_lock();
                          if let Ok(offset_lock) = sample_offset {
                              if let Ok(offset) = offset_lock.try_recv() {
                                  let mut current_sample_offset =
                                      frame_idx_state.write().unwrap();
                                  *current_sample_offset = offset.sample_offset.unwrap();
                              }
                          }

                          let mut i = 0;
                          for d in &mut *data {
                              *d = volume_change(*d, current_volume);
                              i += 1;
                          }

                          // new offset
                          let new_sample_offset = {
                              let mut sample_offset = frame_idx_state.write().unwrap();
                              *sample_offset += i;
                              *sample_offset
                          };
                          // new duration
                          let next_duration =
                              time_base.calc_time(new_sample_offset as u64).seconds;
                          // info!("Next duration: {:?}", next_duration);

                          let prev_duration = { *elapsed_time_state.read().unwrap() };

                          if prev_duration != next_duration {
                              let new_duration = Duration::from_secs(next_duration);

                              let _ = app_handle.emit("timestamp", Some(new_duration.as_secs_f64()));

                              // Also emit back to the decoding thread
                              let _ = timestamp_sender
                                  .try_lock()
                                  .unwrap()
                                  .send(new_duration.as_secs_f64());

                              let mut duration = elapsed_time_state.write().unwrap();
                              *duration = new_duration.as_secs();
                          }
                          // Mute any remaining samples.
                          data[written..].iter_mut().for_each(|s| *s = T::MID);
                      } else {
                          data.iter_mut().for_each(|s| *s = T::MID);
                      }
                  } else {
                      data.iter_mut().for_each(|s| *s = T::MID);
                  }
              },
              move |_err| {},
              None,
          );

          if let Err(_err) = stream_result {
              return Err(AudioOutputError::OpenStreamError);
          }

          let stream = Some(stream_result.unwrap());

          // Start the output stream.
          if let Err(_err) = stream.as_ref().unwrap().play() {
              return Err(AudioOutputError::PlayStreamError);
          }

          let sample_buf = SampleBuffer::<T>::new(duration, spec);

          Ok(Arc::new(Mutex::new(CpalAudioOutputImpl {
              ring_buf,
              ring_buf_producer,
              sample_buf,
              stream,
              resampler: None,
              sample_rate: config.sample_rate.0,
              name: device.name().unwrap_or(String::from("Unknown")),
          })))
      }
  }

  impl<T: AudioOutputSample + Send + Sync> Drop for CpalAudioOutputImpl<T> {
      fn drop(&mut self) {
          self.stop_stream();
      }
  }

  impl<T: AudioOutputSample + Send + Sync> AudioOutput for CpalAudioOutputImpl<T> {
      fn write(
          &mut self,
          decoded: AudioBufferRef<'_>,
          ramp_up_samples: u64,
          ramp_down_samples: u64,
      ) -> () {
          // Do nothing if there are no audio frames.
          if decoded.frames() == 0 {
              return;
          }

          let mut samples = if let Some(resampler) = &mut self.resampler {
              // Resampling is required. The resampler will return interleaved samples in the
              // correct sample format.
              match resampler.resample(decoded) {
                  Some(resampled) => resampled,
                  None => return,
              }
          } else {
              if self.sample_buf.capacity() >= decoded.spec().channels.count() * decoded.frames()
              {
                  // Resampling is not required. Interleave the sample for cpal using a sample buffer.
                  if ramp_up_samples > 0 {
                      self.ramp_up(decoded, ramp_up_samples as usize);
                      self.sample_buf.samples()
                  } else if ramp_down_samples > 0 {
                      self.ramp_down(decoded, ramp_down_samples as usize);
                      self.sample_buf.samples()
                  } else {
                      self.sample_buf.copy_interleaved_ref(decoded);
                      self.sample_buf.samples()
                  }
              } else {
                  // The sample buffer is not big enough to process all the samples.
                  // TODO Error?
                  return;
              }
          };

          // Write all samples to the ring buffer.
          while let Some(written) = self.ring_buf_producer.write_blocking(samples) {
              samples = &samples[written..];
              // Print written
              // info!("written: {}", written);
          }
      }

      fn flush(&mut self) {
          // If there is a resampler, then it may need to be flushed
          // depending on the number of samples it has.
          if let Some(resampler) = &mut self.resampler {
              while let Some(_remaining_samples) = resampler.flush() {

              }
          }

          // Flush is best-effort, ignore the returned result.

          self.sample_buf.clear();
          self.ring_buf.clear();

          // Check what's left now
      }

      fn get_sample_rate(&self) -> u32 {
          return self.sample_rate;
      }

      fn pause(&self) {
          let _pause_result = self.stream.as_ref().unwrap().pause();
      }

      fn resume(&self) {
          let _resume_result = self.stream.as_ref().unwrap().play();
      }

      // Explicitly drop the stream
      fn stop_stream(&mut self) {
          if let Some(stream) = self.stream.take() {
              // Dropping the stream explicitly
              std::mem::drop(stream);
          }
      }

      fn update_resampler(&mut self, spec: SignalSpec, max_frames: u64) -> bool {
          // If we have a default audio device (we always should, but just in case)
          // we check if the track spec differs from the output device
          // if it does - resample the decoded audio using Symphonia.

          if self.sample_rate != spec.rate {
              self.resampler
                  .replace(Resampler::new(spec, self.sample_rate as usize, max_frames));
              return true;
          } else {
              self.resampler.take();
              return false;
          }
      }

      /// Checks if there are any samples left in the buffer that have not been played yet.
      fn has_remaining_samples(&self) -> bool {
          !self.ring_buf.is_empty()
      }

      fn ramp_down(&mut self, buffer: AudioBufferRef, num_samples: usize) {
          self.sample_buf.copy_interleaved_ref(buffer);
          let ramp_len = num_samples.min(self.sample_buf.len());

          for (i, sample) in self.sample_buf.samples_mut()[..ramp_len]
              .iter_mut()
              .enumerate()
          {
              let factor = 1.0 - (i as f32 / ramp_len as f32);
              sample.mul_amp(factor.to_sample());
          }
      }

      fn ramp_up(&mut self, buffer: AudioBufferRef, num_samples: usize) {
          self.sample_buf.copy_interleaved_ref(buffer);
          let ramp_len = num_samples.min(self.sample_buf.len());

          for (i, sample) in self.sample_buf.samples_mut()[..ramp_len]
              .iter_mut()
              .enumerate()
          {
              let factor = i as f32 / ramp_len as f32;
              sample.mul_amp(factor.to_sample());
          }
      }
  }
}

pub fn try_open(
    device_name: &String,
    spec: SignalSpec,
    sample_buf_size: u64,
    volume_control_receiver: Arc<Mutex<Receiver<VolumeEvent>>>,
    sample_offset_receiver: Arc<Mutex<Receiver<SampleOffsetEvent>>>,
    playback_state_receiver: Arc<Mutex<Receiver<bool>>>,
    reset_control_receiver: Arc<Mutex<Receiver<bool>>>,
    device_change_receiver: Arc<Mutex<Receiver<String>>>,
    timestamp_sender: Arc<Mutex<Sender<f64>>>,
    vol: Option<f64>,
    app_handle: tauri::AppHandle,
) -> Result<Arc<Mutex<dyn AudioOutput>>> {
    cpal::CpalAudioOutput::try_open(
        device_name,
        spec,
        sample_buf_size,
        volume_control_receiver,
        sample_offset_receiver,
        playback_state_receiver,
        reset_control_receiver,
        device_change_receiver,
        timestamp_sender,
        vol,
        app_handle,
    )
}

pub fn get_device_by_name(name: Option<String>) -> Option<Device> {
    let host = default_host();
    if name.is_none() {
        return host.default_output_device();
    }
    let name = name.unwrap();
    return host
        .devices()
        .unwrap()
        .find(|device| {
            device.name().unwrap() == name
                && device.supported_output_configs().is_ok_and(|configs| {
                    let mut has = false;
                    for _config in configs {
                        has = true;
                    }
                    has
                })
        })
        .or(host.default_output_device());
}

pub fn get_devices() -> Option<AudioDevices> {
  let host = default_host();

  let cpal_devices: Vec<AudioDevice> = host
    .output_devices()
    .unwrap()
    .map(|device| AudioDevice {
      name: device.name().unwrap(),
    })
    .collect();

  let default_host = host.default_output_device();

  let default: Option<AudioDevice> = if default_host.is_none() {
    None
  } else {
    Some(AudioDevice {
      name: default_host.unwrap().name().unwrap(),
    })
  };

  return Some(AudioDevices {
    devices: cpal_devices,
    default,
  });
}


pub fn poll_audio_devices(app_handle: &AppHandle) {
  println!("Starting audio device polling...");

  let polling_interval = time::Duration::from_millis(1000);

  let mut old_device_count = 0;  

  loop {
    let device_res = get_devices();
    let device_count = if let Some(devices) = &device_res {
      devices.devices.len()
    } else {
      0
    };

    if device_count != old_device_count {
      old_device_count = device_count;

      let _ = app_handle.emit("attached_devices_change", device_res);
    }

    thread::sleep(polling_interval);
  }
}