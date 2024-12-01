use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AudioDevice {
  pub name: String,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
pub struct Equalizer {
  pub gain: u8,
  pub band32: u8,
  pub band64: u8,
  pub band125: u8,
  pub band250: u8,
  pub band500: u8,
  pub band1000: u8,
  pub band2000: u8,
  pub band4000: u8,
  pub band8000: u8,
  pub band16000: u8,
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
  pub eq: Option<Equalizer>,
}


pub enum PlayerEvent {
  LoadFile(PlaybackEvent),
  Seek(f64),
  SetAudioDevice((Option<String>, Option<f64>)),
}

pub enum VolumeEvent {
  SetVolume(f64),
}

pub enum BalanceEvent {
  SetBalance(f64),
}

pub enum EqualizerEvent {
  SetEq(Equalizer),
}

#[derive(Clone, Debug)]
pub struct SampleOffsetEvent {
  pub sample_offset: Option<u64>,
}

pub const PAUSED: u32 = 0;
pub const ACTIVE: u32 = 1;