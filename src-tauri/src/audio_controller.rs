use std::{borrow::Borrow, time::Duration};

use rodio::{cpal::{self, traits::HostTrait}, DeviceTrait, OutputStream, OutputStreamHandle, Sink};

pub fn get_output_devices() -> Vec<String> {
  let host = cpal::default_host();
  let devices = host.output_devices().unwrap();

  let mut res: Vec<String> = vec![];

  for device in devices {
    let device_name_res = device.name();
    
    if device_name_res.is_ok() {
      res.push(device_name_res.unwrap().to_owned());
    }
  }

  return res;
}

pub fn get_output_for_device(device_name: &str) -> (OutputStream, OutputStreamHandle) {
  let host = cpal::default_host();
  let devices = host.output_devices().unwrap();

  let ( mut _stream, mut stream_handle) = OutputStream::try_default().unwrap();

  for device in devices {
    let device_name_res = device.name();

    if device_name_res.is_ok() && device_name_res.unwrap() == device_name {
      ( _stream, stream_handle) = OutputStream::try_from_device(&device).expect("Failed to get output stream for device.");
    }
  } 
  return (_stream,stream_handle);
}

pub struct AudioController {
  pub output_device: Option<String>,
  // pub output_stream: Option<OutputStream>,
  pub output_sink: Sink
}

impl AudioController {
  /// Creates a new AudioController for the provided output device.
  pub fn new(output_dev: Option<String>) -> AudioController {
    let (sink, _) = Sink::new_idle();

    return AudioController {
      output_device: output_dev,
      // output_stream: None,
      output_sink: sink
    };
  }

  /// Seek to the provided offset in the media stream.
  pub fn seek(&mut self, position: u32) {
    let sink = self.output_sink.borrow();

    let _ = sink.try_seek(Duration::new(position.into(), 0));
  }

  /// Pauses the audioController.
  pub fn pause(&mut self) {
    self.output_sink.pause();
  }

  /// Resumes the audioController.
  pub fn resume(&mut self) {
    self.output_sink.play();
  }

  /// Clears the audioController.
  pub fn clear(&mut self) {
    self.output_sink.clear();
  }

  /// Sets the volume level of the audioController.
  pub fn set_volume(&mut self, level: f32) {
    self.output_sink.set_volume(level);
  }
  
  /// Sets the output device to the device with the given name.
  pub fn set_output(&mut self, device_name: &str) {
    
  }

  /// Plays the provided audio file.
  pub fn play_file(&mut self, file_path: &str) {
    let sink = self.output_sink.borrow();

    // sink.set_volume(level);
  }
}