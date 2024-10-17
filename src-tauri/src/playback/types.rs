use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AudioDevice {
  pub name: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AudioDevices {
  pub devices: Vec<AudioDevice>,
  pub default: Option<AudioDevice>,
}

#[derive(Clone, Debug)]
pub struct PlaybackEvent {
  pub file_path: String,
  pub position: Option<f64>,
  pub volume: Option<f64>,
}


pub enum PlayerEvent {
  LoadFile(PlaybackEvent),
  SetAudioDevice(Option<String>),
}

pub enum VolumeEvent {
  SetVolume(f64),
}

#[derive(Clone, Debug)]
pub struct SampleOffsetEvent {
  pub sample_offset: Option<u64>,
}

pub const PAUSED: u32 = 0;
pub const ACTIVE: u32 = 1;