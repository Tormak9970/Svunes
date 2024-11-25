use std::sync::{atomic::AtomicU32, mpsc::{Receiver, Sender}, Arc};

use atomic_wait::wake_all;
use tauri::{async_runtime::Mutex, AppHandle};

use super::{audio::start_audio, output::poll_audio_devices, types::{PlayerEvent, VolumeEvent, ACTIVE, PAUSED}};

#[derive(Clone)]
pub struct AudioPlayer {
  pub player_receiver: Arc<Mutex<Receiver<PlayerEvent>>>,
  pub player_sender: Sender<PlayerEvent>,
  pub decoding_active: Arc<AtomicU32>,
  pub volume_receiver: Arc<Mutex<Receiver<VolumeEvent>>>,
  pub volume_sender: Sender<VolumeEvent>,
}

impl AudioPlayer {
  /// Creates a new AudioPlayer.
  pub fn new() -> AudioPlayer {
    let (player_sender, player_receiver) = std::sync::mpsc::channel();
    let (volume_sender, volume_receiver) = std::sync::mpsc::channel();

    return AudioPlayer {
      player_receiver: Arc::new(Mutex::new(player_receiver)),
      player_sender,
      decoding_active: Arc::new(AtomicU32::new(PAUSED)),
      volume_receiver: Arc::new(Mutex::new(volume_receiver)),
      volume_sender,
    }
  }

  pub fn init(&self, app_handle: AppHandle) -> () {
    let player_receiver = self.player_receiver.clone();
    let volume_receiver = self.volume_receiver.clone();
    let decoding_active = self.decoding_active.clone();

    let handle_clone = app_handle.clone();

    // Create a thread for handling audio events and playback.
    std::thread::spawn(move || {
      start_audio(&decoding_active, &player_receiver, &volume_receiver, &handle_clone);
    });
    
    // Create a thread for polling for changes in audio devices.
    std::thread::spawn(move || {
      poll_audio_devices(&app_handle);
    });
  }

  /// Pauses audio playback.
  pub fn pause(&self) {
    if (&self).decoding_active.load(std::sync::atomic::Ordering::Relaxed) == ACTIVE {
      let _ = &self.decoding_active.store(PAUSED, std::sync::atomic::Ordering::Relaxed);

      wake_all(self.decoding_active.as_ref());
    }
  }

  /// Resumes audio playback.
  pub fn resume(&self) {
    if (&self).decoding_active.load(std::sync::atomic::Ordering::Relaxed) == PAUSED {
      let _ = &self.decoding_active.store(ACTIVE, std::sync::atomic::Ordering::Relaxed);

      wake_all(self.decoding_active.as_ref());
    }
  }
}