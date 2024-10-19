use std::{fs::{self, create_dir_all, File}, io::Write, path::PathBuf, time::Duration};

use image::{imageops::FilterType, ImageReader};
use palette_extract::{get_palette_with_options, Color, MaxColors, PixelEncoding, PixelFilter, Quality};
use serde_json::Value;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest::Client;

use crate::{logger, music_readers::format_album_name_for_image};


fn color_to_rgb(color: &Color) -> String {
  return format!("{} {} {}", color.r, color.g, color.b);
}

#[tauri::command]
/// copies the provided image to the albums directory
pub async fn copy_album_image(app_handle: AppHandle, image_path: String, album_name: String) -> String {
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
    logger::log(&app_handle, format!("failed to read {}: {}.", image_path, err.to_string()).as_str(), 2);
    return "".to_owned();
  }

  let image_reader = image_reader_res.ok().unwrap();
  let image_format = image_reader.format().expect("Image didn't have a format!");
  let image_res = image_reader.decode();

  if image_res.is_err() {
    let err = image_res.err().unwrap();
    logger::log(&app_handle, format!("failed to decode {}: {}.", image_path, err.to_string()).as_str(), 2);
    return "".to_owned();
  }

  let img = image_res.ok().unwrap();

  let resized = img.resize(512, 512, FilterType::CatmullRom);

  let write_res = resized.save_with_format(&file_path, image_format);

  if write_res.is_ok() {
    logger::log(&app_handle, format!("Copying of {} finished.", image_path).as_str(), 0);
  } else {
    let err = write_res.err().unwrap();
    logger::log(&app_handle, format!("Copying of {} failed with {}.", image_path, err.to_string()).as_str(), 2);
  }

  return file_path.as_mut_os_string().to_str().expect("failed to parse copied file path!").to_owned();
}

#[tauri::command]
/// copies the provided image to the artists directory
pub async fn copy_artist_image(app_handle: AppHandle, image_path: String) -> String {
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
    logger::log(&app_handle, format!("Copying of {} finished.", image_path).as_str(), 0);
  } else {
    let err = copy_res.err().unwrap();
    logger::log(&app_handle, format!("Copying of {} failed with {}.", image_path, err.to_string()).as_str(), 2);
  }

  return file_path.as_mut_os_string().to_str().expect("failed to parse copied file path!").to_owned();
}

#[tauri::command]
/// copies the provided image to the playlists directory
pub async fn copy_playlist_image(app_handle: AppHandle, image_path: String) -> String {
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
    logger::log(&app_handle, format!("Copying of {} finished.", image_path).as_str(), 0);
  } else {
    let err = copy_res.err().unwrap();
    logger::log(&app_handle, format!("Copying of {} failed with {}.", image_path, err.to_string()).as_str(), 2);
  }

  return file_path.as_mut_os_string().to_str().expect("failed to parse copied file path!").to_owned();
}

#[tauri::command]
/// Gets the two primary colors from an image
pub async fn get_colors_from_image(app_handle: AppHandle, image_path: String) -> String {
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
      logger::log(&app_handle, format!("failed to decode {}.", image_path).as_str(), 2);
      return serde_json::to_string::<Vec::<Value>>(&vec![]).expect("Couldn't serialize json!");
    }
  } else {
    logger::log(&app_handle, format!("failed to read {}.", image_path).as_str(), 2);
    return serde_json::to_string::<Vec::<Value>>(&vec![]).expect("Couldn't serialize json!");
  }
}

#[tauri::command]
/// Downloads a file from a url.
pub async fn download_image(app_handle: AppHandle, image_url: String, dest_path: String, timeout: u64) -> String {
  logger::log(&app_handle, format!("Downloading image from {} to {}", image_url, dest_path).as_str(), 0);

  let http_client_res = Client::builder().timeout(Duration::from_secs(timeout)).build();
  let http_client: Client = http_client_res.expect("Should have been able to successfully make the reqwest client.");

  let response_res = http_client.get(image_url.clone()).send().await;
  
  if response_res.is_ok() {
    let response = response_res.ok().unwrap();
    let response_bytes = response.bytes().await.expect("Should have been able to await getting response bytes.");

    let mut dest_file: File = File::create(&dest_path).expect("Dest path should have existed.");
    let write_res = dest_file.write_all(&response_bytes);

    if write_res.is_ok() {
      logger::log(&app_handle, format!("Download of {} finished.", image_url.clone()).as_str(), 0);
      return String::from("success");
    } else {
      let err = write_res.err().expect("Request failed, error should have existed.");
      logger::log(&app_handle, format!("Download of {} failed with {}.", image_url.clone(), err.to_string()).as_str(), 0);
      return String::from("failed");
    }
  } else {
    let err = response_res.err().expect("Request failed, error should have existed.");
    logger::log(&app_handle, format!("Download of {} failed with {}.", image_url.clone(), err.to_string()).as_str(), 0);
    return String::from("failed");
  }
}
