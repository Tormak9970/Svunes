#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod reader;
mod writer;
mod logger;
mod header;
mod common;
mod music_readers;
mod mpa_reader;

use std::{fs::{self, DirEntry}, io::Error, panic::{self, Location}, path::PathBuf, process::exit};

use music_readers::{read_flac, read_mp3, read_wav};
use palette_extract::{get_palette_with_options, Color, MaxColors, PixelEncoding, PixelFilter, Quality};
use rayon::iter::IntoParallelRefIterator;
use serde;
use panic_message::get_panic_info_message;
use serde_json::{Map, Value};
use tauri::{
  api::dialog::{blocking::MessageDialogBuilder, MessageDialogButtons}, AppHandle, FsScope, Manager
};

use image::io::Reader as ImageReader;
use rayon::prelude::*;
// use id3::{frame::Picture, Tag, TagLike};

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

fn color_to_rgb(color: Color) -> String {
  return format!("{} {} {}", color.r, color.g, color.b);
}

/// Reads a music file and returns the info.
fn read_music_file(app_handle: AppHandle, file_path: PathBuf, file_type: String, max_length: u64) -> Map<String, Value> {
  if file_type.eq_ignore_ascii_case("mp3") {
    return read_mp3(app_handle, file_path, max_length);
  } else if file_type.eq_ignore_ascii_case("flac") {
    return read_flac(app_handle, file_path, max_length);
  } else {
    return read_wav(app_handle, file_path, max_length);
  } 
}

/// Reads the content of the provided directory.
fn read_music_folder(app_handle: AppHandle, folder_path: PathBuf, max_length: u64) -> Vec<Value> {
  let contents_res = fs::read_dir(folder_path.to_owned());
  
  let mut entries: Vec<Value> = vec![];

  if contents_res.is_ok() {
    let contents = contents_res.ok().unwrap();

    for file_entry_res in contents {
      let file_entry: DirEntry = file_entry_res.ok().expect("File entry should have been ok.");
      let file_path: PathBuf = file_entry.path();

      if file_path.is_dir() {
        let mut folder_entries = read_music_folder(app_handle.to_owned(), file_path.to_owned(), max_length);
        entries.append(&mut folder_entries);
      } else {
        let file_type_str_res = file_path.extension();
        
        if file_type_str_res.is_some() {
          let file_type_str = file_type_str_res.unwrap().to_owned();
          let file_type = file_type_str.into_string().ok().expect("Should have been able to convert the file extension to a String.");
        
          if file_type.eq_ignore_ascii_case("mp3") || file_type.eq_ignore_ascii_case("flac") || file_type.eq_ignore_ascii_case("wav") {
            let mut file_entry = read_music_file(app_handle.to_owned(), file_path.to_owned(), file_type, max_length);
            
            if !file_entry.is_empty() {
              let file_path_str = file_path.as_os_str().to_str().unwrap().to_owned();
              file_entry.insert(String::from("filename"), Value::String(file_path_str));
              entries.push(Value::Object(file_entry));
            }
          }
        }
      }
    }
  } else {
    let err: Error = contents_res.err().unwrap();
    logger::log_to_file(app_handle, format!("Encountered error while reading {}. Error: {}", folder_path.to_owned().to_str().unwrap(), err.to_string()).as_str(), 2);
  }
  
  return entries;
}

#[tauri::command]
/// Reads the contents of the provided directories.
async fn read_music_folders(app_handle: AppHandle, music_folder_paths_str: String, max_length: u64) -> String {
  let music_folder_paths: Vec<String> = serde_json::from_str(music_folder_paths_str.as_str()).expect("Should have been able to deserialize music folders array.");

  for music_folder in &music_folder_paths {
    add_path_to_scope(app_handle.to_owned(), music_folder.to_owned()).await;
  }

  let entries: Vec<Value> = music_folder_paths.par_iter().map(| music_folder | {
    let folder_path: PathBuf = PathBuf::from(music_folder.to_owned());

    let folder_entries = read_music_folder(app_handle.to_owned(), folder_path, max_length);
    return folder_entries;
  }).flatten().collect();

  return serde_json::to_string(&entries).expect("Can't serialize entries to string.");
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

#[tauri::command]
/// Gets the two primary colors from an image
async fn get_colors_from_image(app_handle: AppHandle, image_path: String) -> String {
  let image_reader_res = ImageReader::open(image_path.to_owned());
  
  if image_reader_res.is_ok() {
    let image_reader = image_reader_res.ok().unwrap();

    let image_res = image_reader.decode();

    if image_res.is_ok() {
      let img = image_res.ok().unwrap();

      let color_palette = get_palette_with_options(img.as_bytes(),
        PixelEncoding::Rgb,
        Quality::new(5),
        MaxColors::new(2),
        PixelFilter::White);

      let colors = vec![Value::String(color_to_rgb(color_palette[0])), Value::String(color_to_rgb(color_palette[1]))];
      return serde_json::to_string(&colors).expect("Couldn't serialize json!");
    } else {
      logger::log_to_file(app_handle.to_owned(), format!("failed to decode {}.", image_path).as_str(), 2);
      return serde_json::to_string::<Vec::<Value>>(&vec![]).expect("Couldn't serialize json!");
    }
  } else {
    logger::log_to_file(app_handle.to_owned(), format!("failed to read {}.", image_path).as_str(), 2);
    return serde_json::to_string::<Vec::<Value>>(&vec![]).expect("Couldn't serialize json!");
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
      read_music_folders,
      get_colors_from_image
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