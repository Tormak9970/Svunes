use std::sync::Mutex;

use serde_json::Value;
use tauri::{AppHandle, Manager};

use crate::{app_state::AppState, audio_controller::get_output_devices};

#[tauri::command]
/// Gets a list of the available audio playback devices.
pub async fn get_playback_devices() -> Value {
  let res: Vec<String> = get_output_devices();

  return Value::from(res);
}

#[tauri::command]
/// Sets the playback device that should be used.
pub async fn set_playback_device(app_handle: AppHandle, device_name: String) {
  let state = app_handle.state::<Mutex<AppState>>();

  // Lock the mutex to mutably access the state.
  let mut state = state.lock().unwrap();

  state.controller.set_output(&device_name);
}

#[tauri::command]
/// Plays the provided audio file.
pub async fn play_file(app_handle: AppHandle, file_path: String) {
  let state = app_handle.state::<Mutex<AppState>>();

  // Lock the mutex to mutably access the state.
  let mut state = state.lock().unwrap();

  state.controller.play_file(&file_path);
}

#[tauri::command]
/// Pauses the audio playback.
pub async fn pause_playback(app_handle: AppHandle) {
  let state = app_handle.state::<Mutex<AppState>>();

  // Lock the mutex to mutably access the state.
  let mut state = state.lock().unwrap();

  state.controller.pause();
}

#[tauri::command]
/// Resumes the audio playback.
pub async fn resume_playback(app_handle: AppHandle) {
  let state = app_handle.state::<Mutex<AppState>>();

  // Lock the mutex to mutably access the state.
  let mut state = state.lock().unwrap();

  state.controller.resume();
}

#[tauri::command]
/// Clears the audio playback.
pub async fn clear_playback(app_handle: AppHandle) {
  let state = app_handle.state::<Mutex<AppState>>();

  // Lock the mutex to mutably access the state.
  let mut state = state.lock().unwrap();

  state.controller.clear();
}

#[tauri::command]
/// Seeks to the provided position.
pub async fn seek_in_track(app_handle: AppHandle, pos: u32) {
  let state = app_handle.state::<Mutex<AppState>>();

  // Lock the mutex to mutably access the state.
  let mut state = state.lock().unwrap();

  state.controller.seek(pos);
}

#[tauri::command]
/// Sets the volume of the audio playback.
pub async fn set_volume(app_handle: AppHandle, volume: f32) {
  let state = app_handle.state::<Mutex<AppState>>();

  // Lock the mutex to mutably access the state.
  let mut state = state.lock().unwrap();

  state.controller.set_volume(volume);
}