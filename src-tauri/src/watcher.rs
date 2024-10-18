use std::{path::Path, sync::{mpsc::{Receiver, Sender}, Arc}, time::Duration};

use notify_debouncer_mini::{new_debouncer, notify::*, DebounceEventResult, Debouncer};
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
    
    // Create a thread for handling the folder watching.
    std::thread::spawn(move || {
      println!("starting watcher loop...");

      let mut blacklist: Vec<String> = vec![];
      let mut folders_watching: Vec<String> = vec![];

      // Select recommended watcher for debouncer.
      // Using a callback here, could also be a channel.
      // ! the move here means that blacklist won't update which is wrong.
      let mut debouncer: Debouncer<ReadDirectoryChangesWatcher> = new_debouncer(Duration::from_secs(2), move |res: DebounceEventResult| {
        match res {
          Ok(events) => {
            let blacklist_clone = blacklist.clone();
            let should_reload = events.iter().any(move |e| {
              let file_path = e.path.clone();
              println!("Event {:?} for {:?}",e.kind,e.path);

              let child_of_blacklist = (&blacklist_clone).iter().any(| folder| {
                return file_path.starts_with(folder);
              });

              return !child_of_blacklist;
            });

            if should_reload {
              let _ = app.emit("music_folder_update", None::<String>);
            }
          },
          Err(e) => {
            println!("Error {:?}", e)
          },
        }
      }).unwrap();

      // * Listen for watcher events from the frontend.
      loop {
        let event = event_receiver.try_lock().unwrap().recv();

        if let Ok(result) = event {
          match result {
            WatcherEvent::Update(folders, blacklisted_folders) => {
              blacklist = blacklisted_folders;

              // * Remove watchers from any paths that were removed.
              let folders_watching_loop = folders_watching.clone();
              for current_folder in folders_watching_loop {
                if !folders.contains(&current_folder) {
                  let _ = debouncer.watcher().unwatch(Path::new(&current_folder));
                  
                  let index = (&folders_watching).iter().position(|f| *f == current_folder).unwrap();
                  folders_watching.remove(index);
                }
              }

              // * Add watchers to any paths that were added.
              for folder in folders {
                if !folders_watching.contains(&folder) {
                  let _ = debouncer.watcher().watch(Path::new(&folder), RecursiveMode::Recursive);

                  folders_watching.push(folder);
                }
              }
            }
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