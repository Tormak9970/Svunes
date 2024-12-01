use tauri::{AppHandle, State};

use super::{output, player::AudioPlayer, types::{AudioDevices, BalanceEvent, Equalizer, EqualizerEvent, PlaybackEvent, PlayerEvent, VolumeEvent}};

#[tauri::command]
/// Gets the output devices.
pub fn get_audio_devices(_app_handle: AppHandle) -> Option<AudioDevices> {
  return output::get_devices();
}

#[tauri::command]
/// Sets the audio output device to use.
pub fn set_audio_device(state: State<AudioPlayer>, _app_handle: AppHandle, device_name: Option<String>, balance: f64) {
  let _ = state.player_sender.send(PlayerEvent::SetAudioDevice((device_name, Some(balance))));
}

#[tauri::command]
/// Sets the audio balance for this device.
pub fn set_audio_balance(state: State<AudioPlayer>, _app_handle: AppHandle, balance: f64) {
  let _ = state.balance_sender.send(BalanceEvent::SetBalance(balance));
}

#[tauri::command]
/// Sets the playback equalizer.
pub fn set_equalizer(state: State<AudioPlayer>, _app_handle: AppHandle, equalizer: Equalizer) {
  let _ = state.equalizer_sender.send(EqualizerEvent::SetEq(equalizer));
}

#[tauri::command]
/// Sets the output volume.
pub fn set_volume(state: State<AudioPlayer>, _app_handle: AppHandle, level: f64) {
  let _ = state.volume_sender.send(VolumeEvent::SetVolume(level));
}


#[tauri::command]
/// Loads the provided filepath.
pub fn load_file(state: State<AudioPlayer>, _app_handle: AppHandle, file_path: String, level: f64, position: f64, eq: Equalizer) {
  let _ = state.player_sender.send(PlayerEvent::LoadFile(PlaybackEvent {
    file_path,
    position: Some(position),
    volume: Some(level),
    eq: Some(eq)
  }));
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

#[tauri::command]
/// Seeks to the provided position.
pub fn seek(state: State<AudioPlayer>, _app_handle: AppHandle, position: f64) {
  let _ = state.player_sender.send(PlayerEvent::Seek(position));
}