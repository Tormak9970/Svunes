use std::{path::Path, sync::{mpsc::{Receiver, Sender}, Arc}};

use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher as _};
use tauri::{async_runtime::Mutex, AppHandle, Emitter};

pub enum WatcherEvent {
  Update(Vec<String>, Vec<String>),
}

#[derive(Clone)]
pub struct Watcher {
  receiver: Arc<Mutex<Receiver<WatcherEvent>>>,
  sender: Sender<WatcherEvent>
}

impl Watcher {
  /// Creates a new Watcher.
  pub fn new() -> Watcher {
    let (sender, receiver) = std::sync::mpsc::channel();
    
    return Watcher {
      receiver: Arc::new(Mutex::new(receiver)),
      sender
    };
  }

  /// Initializes the watcher thread.
  pub fn init(&self, app_handle: AppHandle) {
    let event_receiver = self.receiver.clone();

    let app = app_handle.clone();

    let (sender, receiver) = std::sync::mpsc::channel();

    let reciever_mutex = Arc::new(Mutex::new(receiver));
    
    // Create a thread for handling the folder watching.
    std::thread::spawn(move || {
      println!("starting watcher loop...");

      let mut folders_watching: Vec<String> = vec![];

      // Select recommended watcher for debouncer.
      // Using a callback here, could also be a channel.
      let mut watcher = RecommendedWatcher::new(sender, Config::default()).unwrap();

      // * Listen for watcher events from the frontend.
      loop {
        let event = event_receiver.try_lock().unwrap().recv();

        if let Ok(result) = event {
          match result {
            WatcherEvent::Update(folders, _blacklisted_folders) => {
              // * Remove watchers from any paths that were removed.
              let folders_watching_loop = folders_watching.clone();
              for current_folder in folders_watching_loop {
                if !folders.contains(&current_folder) {
                  let _ = watcher.unwatch(Path::new(&current_folder));
                  
                  let index = (&folders_watching).iter().position(|f| *f == current_folder).unwrap();
                  folders_watching.remove(index);
                }
              }

              // * Add watchers to any paths that were added.
              for folder in folders {
                if !folders_watching.contains(&folder) {
                  let _ = watcher.watch(Path::new(&folder), RecursiveMode::Recursive);

                  folders_watching.push(folder);
                }
              }
            }
          }
        }
      }
    });

    // Create a thread for handling the watcher events
    std::thread::spawn(move || {
      println!("starting watcher event thread...");

      loop {
        let event = reciever_mutex.try_lock().unwrap().recv();

        if let Ok(res) = event {
          match res {
            Ok(event) => match event.kind {
                EventKind::Create(_path) => {
                  let _ = app.emit("music_folder_update", None::<String>);
                },
                EventKind::Remove(_path) => {
                  let _ = app.emit("music_folder_update", None::<String>);
                },
                _ => {
                  
                }
            },
            Err(e) => {
              println!("Error {:?}", e)
            },
          }
        }
      }
    });
  }

  /// Updates the paths being watched by the watcher.
  pub fn update(&self, paths: Vec<String>, blacklist: Vec<String>) {
    let _ = self.sender.send(WatcherEvent::Update(paths, blacklist));
  }
}