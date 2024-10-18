

use cpal::traits::{DeviceTrait, HostTrait};
use tauri::{AppHandle, State};

use super::{player::AudioPlayer, types::{AudioDevice, AudioDevices, PlaybackEvent, PlayerEvent, VolumeEvent}};

#[tauri::command]
/// Gets the output devices.
pub fn get_audio_devices(_app_handle: AppHandle) -> Option<AudioDevices> {
  let host = cpal::default_host();

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

#[tauri::command]
/// Sets the audio output device to use.
pub fn set_audio_device(state: State<AudioPlayer>, _app_handle: AppHandle, device_name: Option<String>) {
  let _ = state.player_sender.send(PlayerEvent::SetAudioDevice(device_name));

  state.resume();
}

#[tauri::command]
/// Loads the provided filepath.
pub fn load_file(state: State<AudioPlayer>, _app_handle: AppHandle, file_path: String) {
  let _ = state.player_sender.send(PlayerEvent::LoadFile(PlaybackEvent {
    file_path,
    position: Some(0.0f64),
    volume: Some(1.0f64)
  }));
}

#[tauri::command]
/// Seeks to the provided position.
pub fn seek(state: State<AudioPlayer>, _app_handle: AppHandle, position: f64) {
  let _ = state.player_sender.send(PlayerEvent::Seek(position));
}

#[tauri::command]
/// Sets the playback volume.
pub fn set_volume(state: State<AudioPlayer>, _app_handle: AppHandle, level: f64) {
  let _ = state.volume_sender.send(VolumeEvent::SetVolume(level));
}

#[tauri::command]
/// Resumes audio playback.
pub fn resume_playback(state: State<AudioPlayer>, _app_handle: AppHandle) {
  state.resume();
}

#[tauri::command]
/// Resumes audio playback.
pub fn pause_playback(state: State<AudioPlayer>, _app_handle: AppHandle) {
  state.pause();
}