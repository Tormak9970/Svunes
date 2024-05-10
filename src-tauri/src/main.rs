#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod reader;
mod writer;
mod logger;

use std::{fs::{self, DirEntry}, io::Error, panic::{self, Location}, path::PathBuf, process::exit};

use serde;
use panic_message::get_panic_info_message;
use symphonia::{core::{formats::{FormatOptions, FormatReader}, io::MediaSourceStream}, default::formats::FlacReader};
use tauri::{
  api::dialog::{blocking::MessageDialogBuilder, MessageDialogButtons}, AppHandle, FsScope, Manager
};

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

/// Reads a .flac file and returns the info.
fn read_flac(app_handle: AppHandle, file_path: PathBuf) -> String {
  let file_src = fs::File::open(file_path.to_owned()).expect("failed to open file");
  // Create the media source stream.
  let mss = MediaSourceStream::new(Box::new(file_src), Default::default());

  // Use the default options for metadata and format readers.
  let fmt_opts: FormatOptions = Default::default();

  // Probe the media source.
  let flac_reader_res = FlacReader::try_new(mss, &fmt_opts);

  if flac_reader_res.is_ok() {
    let mut flac_reader = flac_reader_res.ok().unwrap();

    let mut metadata = flac_reader.metadata();
    let newest_res = metadata.skip_to_latest();

    let mut result = String::from("{");

    if newest_res.is_some() {
      let newest = newest_res.unwrap();
      let tags = newest.tags();

      for tag in tags {
        if !tag.key.eq_ignore_ascii_case("lyrics") && !tag.key.eq_ignore_ascii_case("lyricist") && !tag.key.eq_ignore_ascii_case("albumartist") && !tag.key.eq_ignore_ascii_case("location") {
          result.push_str(format!("\"{}\":\"{}\",", tag.key.to_ascii_lowercase().as_str(), tag.value.to_string()).as_str());
        }
      }
    }

    // result.push_str(format!("\"filepath\":\"{}\"", file_path.as_os_str().to_str().unwrap()).as_str()); // TODO save the file path
    result = (&result[..result.len() - 1]).to_owned();
    result.push_str("}");
    return result;
  } else {
    logger::log_to_file(app_handle.to_owned(), format!("Failed to parse {} with flac parser.", file_path.as_os_str().to_str().unwrap()).as_str(), 2);
    return String::from("");
  }
}

/// Reads a .mp3 file and returns the info.
fn read_mp3(app_handle: AppHandle, file_path: PathBuf) -> String {
  return String::from("{}");
}

/// Reads a .wav file and returns the info.
fn read_wav(app_handle: AppHandle, file_path: PathBuf) -> String {
  return String::from("{}");
}


/// Reads a music file and returns the info.
fn read_music_file(app_handle: AppHandle, file_path: PathBuf, file_type: String) -> String {
  if file_type.eq_ignore_ascii_case("mp3") {
    return read_mp3(app_handle, file_path);
  } else if file_type.eq_ignore_ascii_case("flac") {
    return read_flac(app_handle, file_path);
  } else {
    return read_wav(app_handle, file_path);
  } 
}

/// Reads the content of the provided directory.
fn read_music_folder(app_handle: AppHandle, folder_path: PathBuf) -> String {
  let contents_res = fs::read_dir(folder_path.to_owned());
  
  if contents_res.is_ok() {
    let contents = contents_res.ok().unwrap();

    let mut result = String::from("");

    for file_entry_res in contents {
      let file_entry: DirEntry = file_entry_res.ok().expect("File entry should have been ok.");
      let file_path: PathBuf = file_entry.path();

      if file_path.is_dir() {
        let folder_result = read_music_folder(app_handle.to_owned(), file_path.to_owned());
        result.push_str(&folder_result);
      } else {
        let file_type_str_res = file_path.extension();
        
        if file_type_str_res.is_some() {
          let file_type_str = file_type_str_res.unwrap().to_owned();
          let file_type = file_type_str.into_string().ok().expect("Should have been able to convert the file extension to a String.");
        
          if file_type.eq_ignore_ascii_case("mp3") || file_type.eq_ignore_ascii_case("flac") || file_type.eq_ignore_ascii_case("wav") {
            let file_result = read_music_file(app_handle.to_owned(), file_path, file_type);
            result.push_str(&file_result);
            result.push_str(",");
          }
        }
      }
    }

    return result;
  } else {
    let err: Error = contents_res.err().unwrap();
    logger::log_to_file(app_handle, format!("Encountered error while reading {}. Error: {}", folder_path.to_owned().to_str().unwrap(), err.to_string()).as_str(), 2);
    return String::from("");
  }
}

#[tauri::command]
/// Reads the contents of the provided directories.
async fn read_music_folders(app_handle: AppHandle, music_folder_paths_str: String) -> String {
  let music_folder_paths: Vec<String> = serde_json::from_str(music_folder_paths_str.as_str()).expect("Should have been able to deserialize music folders array.");

  let mut result = String::from("[");

  for music_folder in music_folder_paths {
    add_path_to_scope(app_handle.to_owned(), music_folder.to_owned()).await;
    let folder_path: PathBuf = PathBuf::from(music_folder.to_owned());

    let file_result: String = read_music_folder(app_handle.to_owned(), folder_path);
    result.push_str(&file_result);
  }

  result = (&result[..result.len() - 1]).to_owned();
  result.push_str("]");

  return result;
}

#[tauri::command]
/// Adds the provided path to Tauri FS and Asset scope.
async fn add_path_to_scope(app_handle: AppHandle, target_path: String) -> bool {
  let pre_canonicalized_path: PathBuf = PathBuf::from(&target_path);

  if !pre_canonicalized_path.as_path().exists() {
    logger::log_to_file(app_handle.to_owned(), format!("Error adding {} to scope. Path does not exist.", &target_path).as_str(), 2);
    return false;
  }

  let path_as_buf: PathBuf = pre_canonicalized_path.canonicalize().expect("Should have been able to resolve target path.");

  let fs_scope = app_handle.fs_scope();
  let asset_scope = app_handle.asset_protocol_scope();

  let fs_res = FsScope::allow_directory(&fs_scope, &path_as_buf, true);
  let asset_res = FsScope::allow_directory(&asset_scope, &path_as_buf, true);

  if fs_res.is_ok() && asset_res.is_ok() {
    logger::log_to_file(app_handle.to_owned(), format!("Added {} to scope.", &target_path).as_str(), 0);
    return true;
  } else if fs_res.is_err() {
    let err = fs_res.err().unwrap();
    logger::log_to_file(app_handle.to_owned(), format!("Error adding {} to scope. FS Scope Error: {}", &target_path, err.to_string()).as_str(), 0);
  } else if asset_res.is_err() {
    let err = asset_res.err().unwrap();
    logger::log_to_file(app_handle.to_owned(), format!("Error adding {} to scope. Asset Scope Error: {}", &target_path, err.to_string()).as_str(), 0);
  } else {
    let fs_err = fs_res.err().unwrap();
    let asset_err = asset_res.err().unwrap();
    logger::log_to_file(app_handle.to_owned(), format!("Error adding {} to scope. FS Scope Error: {}. Asset Scope Error: {}", &target_path, fs_err.to_string(), asset_err.to_string()).as_str(), 0);
  }

  return false;
}

#[tauri::command]
/// Toggles the dev tools for the current window.
async fn toggle_dev_tools(app_handle: AppHandle, enable: bool) {
  let window = app_handle.get_window("main").expect("Should have been able to get the main window.");
  
  if enable {
    window.open_devtools();
  } else {
    window.close_devtools();
  }
}

/// This app's main function.
fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      logger::clean_out_log,
      logger::log_to_file,
      add_path_to_scope,
      toggle_dev_tools,
      read_music_folders
    ])
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
      println!("{}, {argv:?}, {cwd}", app.package_info().name);

      app.emit_all("single-instance", Payload { args: argv, cwd }).unwrap();
    }))
    .setup(| app | {
      let app_handle = app.handle();
      let log_file_path = Box::new(String::from(logger::get_core_log_path(&app_handle).into_os_string().to_str().expect("Should have been able to convert osString to str.")));
      
      logger::clean_out_log(app_handle.clone());

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
        logger::log_to_given_file(&log_file_path_buf, "Please open an issue at https://github.com/Tormak9970/Tunistic/issues", 2);

        let hit_ok = MessageDialogBuilder::new("Panic!", "Check your log file for more information, and please open an issue at https://github.com/Tormak9970/Tunistic/issues")
          .buttons(MessageDialogButtons::Ok)
          .show();

        if hit_ok {
          exit(1);
        }
      }));

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}