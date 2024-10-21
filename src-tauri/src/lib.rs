
mod logger;
mod symphonia_mock;
mod music_readers;
mod music_writers;
mod playback;
mod watcher;
mod image_utils;
mod platforms;

use platforms::init_platform_specifics;
use playback::player::AudioPlayer;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FsExt;
use watcher::Watcher;

use std::{fs, panic::{self, Location}, path::PathBuf, process::exit, sync::mpsc::channel};

use music_readers::read_music_folder;
use music_writers::{write_music_file, SongEditFields};
use rayon::iter::IntoParallelRefIterator;
use panic_message::get_panic_info_message;
use serde_json::{Map, Value};
use tauri::{self, AppHandle, Manager, RunEvent, State};

#[cfg(not(any(target_os = "ios", target_os = "android")))]
use tauri::Emitter;

use rayon::prelude::*;

#[cfg(not(any(target_os = "ios", target_os = "android")))]
#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

#[tauri::command]
/// Writes changes to a list of music files.
fn write_music_files(app_handle: AppHandle, changes_str: String) -> bool {
  let changes: Map<String, Value> = serde_json::from_str(&changes_str).expect("Couldn't deserialize changes map.");
  
  let (sender, receiver) = channel();
  
  let status: Vec<bool> = changes.keys().par_bridge().map_with(sender, | log_sender, key | {
    let file_path = key.to_owned();

    let value = changes.get(key).unwrap().to_owned();
    let changed_fields: SongEditFields = serde_json::from_value(value).unwrap();

    return write_music_file(log_sender, file_path, changed_fields);
  }).collect();

  receiver.iter().for_each(| log: String | {
    logger::log(&app_handle, &log, 2);
  });

  return status.into_iter().all(| success | { return success; });
}

#[tauri::command]
/// Deletes the given songs.
fn delete_songs(app_handle: AppHandle, file_paths_str: String) -> bool {
  let mut success = true;
  let file_paths: Vec<String> = serde_json::from_str(&file_paths_str).expect("Couldn't deserialize file paths array.");

  for file_path_str in file_paths {
    let file_path = PathBuf::from(&file_path_str);

    let result = fs::remove_file(file_path);

    if result.is_err() {
      success = false;
      let err = result.err().unwrap();
      logger::log(&app_handle, format!("Failed to delete {}: {}", &file_path_str, err.to_string()).as_str(), 0);
      break;
    }
  }

  if !success {
    logger::log(&app_handle, "Successfully deleted songs.", 0);
  }

  return success;
}

#[tauri::command]
/// Reads the contents of the provided directories.
async fn read_music_folders(state: State<'_, Watcher>, app_handle: AppHandle, music_folder_paths_str: String, blacklist_folder_paths_str: String, max_length: u64) -> Result<String, ()> {
  let music_folder_paths: Vec<String> = serde_json::from_str(&music_folder_paths_str).expect("Couldn't deserialize music folders array.");
  let blacklist_folder_paths: Vec<String> = serde_json::from_str(&blacklist_folder_paths_str).expect("Couldn't deserialize blacklist folders array.");

  let (sender, receiver) = channel();

  for music_folder in &music_folder_paths {
    add_path_to_scope(app_handle.clone(), music_folder.clone()).await;
  }

  let _ = state.update(music_folder_paths.clone(), blacklist_folder_paths.clone());

  let entries: Vec<Value> = music_folder_paths.par_iter().filter(| folder | !blacklist_folder_paths.contains(&folder)).map_with(sender, | log_sender, music_folder | {
    let folder_path: PathBuf = PathBuf::from(&music_folder);

    let folder_entries = read_music_folder(&app_handle, log_sender, folder_path, &blacklist_folder_paths, max_length);
    return folder_entries;
  }).flatten().collect();
  
  receiver.iter().for_each(| log: String | {
    logger::log(&app_handle, &log, 2);
  });

  return Ok(serde_json::to_string(&entries).expect("Can't serialize entries to string."));
}

#[tauri::command]
/// Adds the provided path to Tauri FS and Asset scope.
async fn add_path_to_scope(app_handle: AppHandle, target_path: String) -> bool {
  let path_as_buf: PathBuf = PathBuf::from(&target_path);

  if !path_as_buf.as_path().exists() {
    logger::log(&app_handle, format!("Error adding {} to scope. Path does not exist.", &target_path).as_str(), 2);
    return false;
  }

  let fs_scope = app_handle.fs_scope();
  let asset_scope = app_handle.asset_protocol_scope();

  fs_scope.allow_directory(&path_as_buf, true);
  let asset_res = asset_scope.allow_directory(&path_as_buf, true);

  if asset_res.is_ok() {
    logger::log(&app_handle, format!("Added {} to scope.", &target_path).as_str(), 0);
    return true;
  }

  let err = asset_res.err().unwrap();
  logger::log(&app_handle, format!("Error adding {} to scope. Asset Scope Error: {}", &target_path, err.to_string()).as_str(), 2);
  return false;
}

#[tauri::command]
/// Toggles the dev tools for the current window.
async fn toggle_dev_tools(app_handle: AppHandle, enable: bool) {
  let window = app_handle.get_webview_window("main").expect("Should have been able to get the main window.");
  
  if enable {
    window.open_devtools();
  } else {
    window.close_devtools();
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[allow(unused_mut)]
/// This app's main function.
pub fn run() {
  let mut builder = tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_store::Builder::new().build());

    
  #[cfg(not(any(target_os = "ios", target_os = "android")))]
  {
    builder = builder
      .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
        println!("{}, {argv:?}, {cwd}", app.package_info().name);
        app.emit("single-instance", Payload { args: argv, cwd }).unwrap();
      }))
      .plugin(tauri_plugin_updater::Builder::new().build());
  }

  // * The reason for defining these here is that it will survive for the lifetime of the app.
  let player: AudioPlayer = AudioPlayer::new();
  let watcher = Watcher::new();

  builder.manage(player)
    .manage(watcher)
    .setup(| app | {
      let app_handle = app.handle().clone();
      let log_file_path = Box::new(String::from(logger::get_core_log_path(&app_handle).into_os_string().to_str().expect("Should have been able to convert osString to str.")));
      
      init_platform_specifics(app_handle.clone());

      logger::clean_out_log(app_handle.clone());

      let player_state: State<AudioPlayer> = app.state();
      player_state.init(app_handle.clone());
      
      let watcher_state: State<Watcher> = app.state();
      watcher_state.init(app_handle.clone());

      panic::set_hook(Box::new(move | panic_info | {
        let path_str = (*log_file_path).to_owned();
        let log_file_path_buf: PathBuf = PathBuf::from(path_str);

        let location_res: Option<&Location> = panic_info.location();
        // let message_res = panic_info.message();
        // let message_res: Option<&Arguments> = None;

        let message_res = get_panic_info_message(panic_info);

        let mut log_message: String = String::from("Panic occured but no additional info was provided!");

        if location_res.is_some() && message_res.is_some() {
          let location = location_res.expect("Should have been able to get panic location");
          let message = message_res.expect("Should have been able to get panic message");
          log_message = format!("PANIC: File '{}' at line {}: {}", location.file(), location.line(), message).to_string();
        } else if location_res.is_some() {
          let location = location_res.expect("Should have been able to get panic location");
          log_message = format!("PANIC: File '{}' at line {}: No provided message", location.file(), location.line()).to_string();
        } else if message_res.is_some() {
          let message = message_res.expect("Should have been able to get panic message");
          log_message = format!("PANIC: File 'UNKOWN' at line UNKOWN: {}", message).to_string();
        }

        logger::log_to_given_file(&log_file_path_buf, &log_message, 2);
        logger::log_to_given_file(&log_file_path_buf, "Please open an issue at https://github.com/Tormak9970/Svunes/issues", 2);

        let dialog = app_handle.dialog()
          .message("Check your log file for more information, and please open an issue at https://github.com/Tormak9970/Svunes/issues")
          .title("Panic!");

        let hit_ok = dialog.blocking_show();

        if hit_ok {
          exit(1);
        }
      }));

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      logger::clean_out_log,
      logger::log_to_file,
      add_path_to_scope,
      read_music_folders,
      delete_songs,
      write_music_files,
      toggle_dev_tools,
      image_utils::get_colors_from_image,
      image_utils::copy_album_image,
      image_utils::copy_artist_image,
      image_utils::copy_playlist_image,
      image_utils::download_image,
      playback::ipc::get_audio_devices,
      playback::ipc::set_audio_device,
      playback::ipc::load_file,
      playback::ipc::seek,
      playback::ipc::set_volume,
      playback::ipc::resume_playback,
      playback::ipc::pause_playback,
    ])
    .build(tauri::generate_context!())
    .expect("error while building tauri application")
    .run(move |app_handle, event| {
      match event {
        RunEvent::WindowEvent {
          event: tauri::WindowEvent::CloseRequested { api: _, .. },
          label,
          ..
        } => {
          println!("closing window...");

          if label == "main" {
            app_handle.exit(0);
          }
        }
        _ => (),
      }
    });
}