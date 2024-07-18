
mod logger;
mod header;
mod common;
mod music_readers;
mod music_writers;
mod mpa_reader;

use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FsExt;
use tauri_plugin_http::reqwest::Client;

use std::{fs::{self, create_dir_all, File}, io::Write, panic::{self, Location}, path::PathBuf, process::exit, sync::mpsc::channel, time::Duration};

use music_readers::{format_album_name_for_image, read_music_folder};
use music_writers::{write_music_file, SongEditFields};
use palette_extract::{get_palette_with_options, Color, MaxColors, PixelEncoding, PixelFilter, Quality};
use rayon::iter::IntoParallelRefIterator;
use serde;
use panic_message::get_panic_info_message;
use serde_json::{Map, Value};
use tauri::{self, AppHandle, Manager};

use image::{imageops::FilterType, io::Reader as ImageReader};
use rayon::prelude::*;

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

fn color_to_rgb(color: &Color) -> String {
  return format!("{} {} {}", color.r, color.g, color.b);
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
    logger::log_to_file(app_handle.clone(), &log, 2);
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
      logger::log_to_file(app_handle.clone(), format!("Failed to delete {}: {}", &file_path_str, err.to_string()).as_str(), 0);
      break;
    }
  }

  if !success {
    logger::log_to_file(app_handle.clone(), "Successfully deleted songs.", 0);
  }

  return success;
}

#[tauri::command]
/// Reads the contents of the provided directories.
async fn read_music_folders(app_handle: AppHandle, music_folder_paths_str: String, blacklist_folder_paths_str: String, max_length: u64) -> String {
  let music_folder_paths: Vec<String> = serde_json::from_str(&music_folder_paths_str).expect("Couldn't deserialize music folders array.");
  let blacklist_folder_paths: Vec<String> = serde_json::from_str(&blacklist_folder_paths_str).expect("Couldn't deserialize blacklist folders array.");

  let (sender, receiver) = channel();

  for music_folder in &music_folder_paths {
    add_path_to_scope(app_handle.clone(), music_folder.clone()).await;
  }

  let entries: Vec<Value> = music_folder_paths.par_iter().filter(| folder | !blacklist_folder_paths.contains(&folder)).map_with(sender, | log_sender, music_folder | {
    let folder_path: PathBuf = PathBuf::from(&music_folder);

    let folder_entries = read_music_folder(app_handle.clone(), log_sender, folder_path, &blacklist_folder_paths, max_length);
    return folder_entries;
  }).flatten().collect();
  
  receiver.iter().for_each(| log: String | {
    logger::log_to_file(app_handle.clone(), &log, 2);
  });

  return serde_json::to_string(&entries).expect("Can't serialize entries to string.");
}

#[tauri::command]
/// Adds the provided path to Tauri FS and Asset scope.
async fn add_path_to_scope(app_handle: AppHandle, target_path: String) -> bool {
  let path_as_buf: PathBuf = PathBuf::from(&target_path);

  if !path_as_buf.as_path().exists() {
    logger::log_to_file(app_handle.clone(), format!("Error adding {} to scope. Path does not exist.", &target_path).as_str(), 2);
    return false;
  }

  let fs_scope = app_handle.fs_scope();
  let asset_scope = app_handle.asset_protocol_scope();

  fs_scope.allow_directory(&path_as_buf, true);
  let asset_res = asset_scope.allow_directory(&path_as_buf, true);

  if asset_res.is_ok() {
    logger::log_to_file(app_handle.clone(), format!("Added {} to scope.", &target_path).as_str(), 0);
    return true;
  }

  let err = asset_res.err().unwrap();
  logger::log_to_file(app_handle.clone(), format!("Error adding {} to scope. Asset Scope Error: {}", &target_path, err.to_string()).as_str(), 2);
  return false;
}

#[tauri::command]
/// copies the provided image to the albums directory
async fn copy_album_image(app_handle: AppHandle, image_path: String, album_name: String) -> String {
  let bundle_id: String = app_handle.config().identifier.to_owned();
  
  let app_cache_dir = app_handle.path().cache_dir().expect("Couldn't resolve app cache dir.");
  let mut file_path = app_cache_dir.join(&bundle_id).join("albums");

  if !file_path.exists() {
    let _ = create_dir_all(&file_path);
  }

  let mut file_name = format_album_name_for_image(album_name);
  let path_as_buf = PathBuf::from(&image_path);
  let extension = path_as_buf.extension().expect("Couldn't get extension").to_str().unwrap();
  file_name.push('.');
  file_name.push_str(extension);
  file_path.push(file_name);

  let image_reader_res = ImageReader::open(&image_path);
  
  if image_reader_res.is_err() {
    let err = image_reader_res.err().unwrap();
    logger::log_to_file(app_handle.clone(), format!("failed to read {}: {}.", image_path, err.to_string()).as_str(), 2);
    return "".to_owned();
  }

  let image_reader = image_reader_res.ok().unwrap();
  let image_format = image_reader.format().expect("Image didn't have a format!");
  let image_res = image_reader.decode();

  if image_res.is_err() {
    let err = image_res.err().unwrap();
    logger::log_to_file(app_handle.clone(), format!("failed to decode {}: {}.", image_path, err.to_string()).as_str(), 2);
    return "".to_owned();
  }

  let img = image_res.ok().unwrap();

  let resized = img.resize(512, 512, FilterType::CatmullRom);

  let write_res = resized.save_with_format(&file_path, image_format);

  if write_res.is_ok() {
    logger::log_to_file(app_handle.clone(), format!("Copying of {} finished.", image_path).as_str(), 0);
  } else {
    let err = write_res.err().unwrap();
    logger::log_to_file(app_handle.clone(), format!("Copying of {} failed with {}.", image_path, err.to_string()).as_str(), 2);
  }

  return file_path.as_mut_os_string().to_str().expect("failed to parse copied file path!").to_owned();
}

#[tauri::command]
/// copies the provided image to the artists directory
async fn copy_artist_image(app_handle: AppHandle, image_path: String) -> String {
  let bundle_id: String = app_handle.config().identifier.to_owned();
  
  let app_cache_dir = app_handle.path().cache_dir().expect("Couldn't resolve app cache dir.");
  let mut file_path = app_cache_dir.join(&bundle_id).join("artists");

  if !file_path.exists() {
    let _ = create_dir_all(&file_path);
  }

  let image_pathbuf = PathBuf::from(&image_path);
  let file_name = image_pathbuf.file_name().expect("Couldn't get filename of artist image.");
  file_path.push(file_name);

  let copy_res = fs::copy(&image_path, &file_path);

  if copy_res.is_ok() {
    logger::log_to_file(app_handle.clone(), format!("Copying of {} finished.", image_path).as_str(), 0);
  } else {
    let err = copy_res.err().unwrap();
    logger::log_to_file(app_handle.clone(), format!("Copying of {} failed with {}.", image_path, err.to_string()).as_str(), 2);
  }

  return file_path.as_mut_os_string().to_str().expect("failed to parse copied file path!").to_owned();
}

#[tauri::command]
/// copies the provided image to the playlists directory
async fn copy_playlist_image(app_handle: AppHandle, image_path: String) -> String {
  let bundle_id: String = app_handle.config().identifier.to_owned();
  
  let app_cache_dir = app_handle.path().cache_dir().expect("Couldn't resolve app cache dir.");
  let mut file_path = app_cache_dir.join(&bundle_id).join("playlists");

  if !file_path.exists() {
    let _ = create_dir_all(&file_path);
  }

  let image_pathbuf = PathBuf::from(&image_path);
  let file_name = image_pathbuf.file_name().expect("Couldn't get filename of playlist image.");
  file_path.push(file_name);

  let copy_res = fs::copy(&image_path, &file_path);

  if copy_res.is_ok() {
    logger::log_to_file(app_handle.clone(), format!("Copying of {} finished.", image_path).as_str(), 0);
  } else {
    let err = copy_res.err().unwrap();
    logger::log_to_file(app_handle.clone(), format!("Copying of {} failed with {}.", image_path, err.to_string()).as_str(), 2);
  }

  return file_path.as_mut_os_string().to_str().expect("failed to parse copied file path!").to_owned();
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

      let color_palette = get_palette_with_options(
        img.as_bytes(),
        PixelEncoding::Rgb,
        Quality::new(5),
        MaxColors::new(5),
        PixelFilter::White
      );

      let colors: Vec<Value> = color_palette.iter().map(| color | {
        return Value::String(color_to_rgb(color));
      }).collect();
      
      return serde_json::to_string(&colors).expect("Couldn't serialize json!");
    } else {
      logger::log_to_file(app_handle.clone(), format!("failed to decode {}.", image_path).as_str(), 2);
      return serde_json::to_string::<Vec::<Value>>(&vec![]).expect("Couldn't serialize json!");
    }
  } else {
    logger::log_to_file(app_handle.clone(), format!("failed to read {}.", image_path).as_str(), 2);
    return serde_json::to_string::<Vec::<Value>>(&vec![]).expect("Couldn't serialize json!");
  }
}

#[tauri::command]
/// Downloads a file from a url.
async fn download_image(app_handle: AppHandle, image_url: String, dest_path: String, timeout: u64) -> String {
  logger::log_to_file(app_handle.to_owned(), format!("Downloading image from {} to {}", image_url, dest_path).as_str(), 0);

  let http_client_res = Client::builder().timeout(Duration::from_secs(timeout)).build();
  let http_client: Client = http_client_res.expect("Should have been able to successfully make the reqwest client.");

  let response_res = http_client.get(image_url.clone()).send().await;
  
  if response_res.is_ok() {
    let response = response_res.ok().unwrap();
    let response_bytes = response.bytes().await.expect("Should have been able to await getting response bytes.");

    let mut dest_file: File = File::create(&dest_path).expect("Dest path should have existed.");
    let write_res = dest_file.write_all(&response_bytes);

    if write_res.is_ok() {
      logger::log_to_file(app_handle.to_owned(), format!("Download of {} finished.", image_url.clone()).as_str(), 0);
      return String::from("success");
    } else {
      let err = write_res.err().expect("Request failed, error should have existed.");
      logger::log_to_file(app_handle.to_owned(), format!("Download of {} failed with {}.", image_url.clone(), err.to_string()).as_str(), 0);
      return String::from("failed");
    }
  } else {
    let err = response_res.err().expect("Request failed, error should have existed.");
    logger::log_to_file(app_handle.to_owned(), format!("Download of {} failed with {}.", image_url.clone(), err.to_string()).as_str(), 0);
    return String::from("failed");
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
/// This app's main function.
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      logger::clean_out_log,
      logger::log_to_file,
      add_path_to_scope,
      read_music_folders,
      get_colors_from_image,
      copy_album_image,
      copy_artist_image,
      copy_playlist_image,
      delete_songs,
      write_music_files,
      download_image
    ])
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_http::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    // .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
    //   println!("{}, {argv:?}, {cwd}", app.package_info().name);
    //   app.emit("single-instance", Payload { args: argv, cwd }).unwrap();
    // }))
    .setup(| app | {
      let app_handle = app.handle().clone();
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

        let dialog = app_handle.dialog()
          .message("Check your log file for more information, and please open an issue at https://github.com/Tormak9970/Tunistic/issues")
          .title("Panic!")
          .ok_button_label("Ok");

        let hit_ok = dialog.blocking_show();

        if hit_ok {
          exit(1);
        }
      }));

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}