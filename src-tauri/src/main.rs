#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod reader;
mod writer;
mod logger;

use std::{fs::{self, DirEntry, File}, io::{Error, Write}, panic::{self, Location}, path::PathBuf, process::exit};

use serde;
use panic_message::get_panic_info_message;
use serde_json::{Map, Value};
use symphonia::{core::{formats::{FormatOptions, FormatReader}, io::MediaSourceStream, meta::{MetadataOptions, StandardVisualKey, Visual}, probe::Hint, units::TimeBase}, default::formats::FlacReader};
use tauri::{
  api::{dialog::{blocking::MessageDialogBuilder, MessageDialogButtons}, path::cache_dir}, AppHandle, FsScope, Manager
};
// use id3::{frame::Picture, Tag, TagLike};

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

/// Writes the album visual to the cache folder and returns the path
fn write_visual_to_cache(app_handle: AppHandle, visual: &Visual, album_title: String) -> String {
  let bundle_id: String = app_handle.config().tauri.bundle.identifier.to_owned();
  
  let app_cache_dir = cache_dir().expect("Couldn't resolve app cache dir.");
  let mut file_path = app_cache_dir.join(&bundle_id).join("albums");

  if !file_path.exists() {
    let _ = fs::create_dir_all(file_path.to_owned());
  }

  let mut file_type;
  let lower_case = visual.media_type.to_ascii_lowercase();

  if visual.media_type.contains("/") {
    file_type = &visual.media_type[6..];
  } else {
    file_type = &lower_case;
  }

  let mut file_name = (&album_title[1..album_title.len() - 1]).to_owned();
  file_name.push_str(".");
  file_name.push_str(file_type);
  file_name = file_name.replace(&[':'][..], "");

  file_path = file_path.join(file_name.to_owned());

  if !file_path.exists() {
    let mut dest_file: File = File::create(&file_path).expect("Dest path should have existed.");
    let write_res = dest_file.write_all(visual.data.as_ref());

    if write_res.is_ok() {
      logger::log_to_file(app_handle.to_owned(), format!("Writing of {} finished.", file_name).as_str(), 0);
    } else {
      let err = write_res.err().unwrap();
      logger::log_to_file(app_handle.to_owned(), format!("Writing of {} failed with {}.", file_name, err.to_string()).as_str(), 0);
    }
  }

  return file_path.as_mut_os_string().to_str().unwrap().to_owned();
}

/// Reads a .flac file and returns the info.
fn read_flac(app_handle: AppHandle, file_path: PathBuf) -> Map<String, Value> {
  let file_src = fs::File::open(file_path.to_owned()).expect("failed to open file");
  let file_metadata = file_src.metadata().unwrap();
  
  let mss = MediaSourceStream::new(Box::new(file_src), Default::default());
  let fmt_opts: FormatOptions = Default::default();

  let flac_reader_res = FlacReader::try_new(mss, &fmt_opts);

  let mut entry: Map<String, Value> = Map::new();

  if flac_reader_res.is_ok() {
    let mut flac_reader = flac_reader_res.ok().unwrap();
    let mut metadata = flac_reader.metadata();

    let newest_res = metadata.skip_to_latest();

    if newest_res.is_some() {
      let newest = newest_res.unwrap();
      let tags = newest.tags();

      // ? We want songTitle, albumName, artist, genre, releaseYear, and trackNumber

      for tag in tags {
        if !tag.key.eq_ignore_ascii_case("lyrics") && !tag.key.eq_ignore_ascii_case("lyricist") && !tag.key.eq_ignore_ascii_case("albumartist") && !tag.key.eq_ignore_ascii_case("location") {
          entry.insert(tag.key.to_ascii_lowercase().to_owned(), Value::String(tag.value.to_string()));
        }
      }
      
      let visuals = newest.visuals();

      for visual in visuals {
        let usage = visual.usage;
        
        if usage.is_some() && usage.unwrap() == StandardVisualKey::FrontCover {
          let album_title = entry.get("album").unwrap().to_string();
          entry.insert(String::from("albumpath"), Value::String(write_visual_to_cache(app_handle.to_owned(), visual, album_title)));
        }
      }
    }

    let default_track = flac_reader.default_track().unwrap();
    let code_params = &default_track.codec_params;
    entry.insert(String::from("bitrate"), Value::String(code_params.sample_rate.unwrap().to_string()));

    let time_base = code_params.time_base.unwrap();
    let num_framse = code_params.n_frames.unwrap();
    let length: symphonia::core::units::Time = TimeBase::calc_time(&time_base, num_framse);
    let time = length.seconds;
    let minutes = time / 60;
    let seconds = time % 60;

    let mut time_str = minutes.to_string();
    time_str.push_str(":");

    if seconds < 10 {
      time_str.push_str("0");
    }
    time_str.push_str(seconds.to_string().as_str());

    entry.insert(String::from("length"), Value::String(time_str));

    entry.insert(String::from("size"), Value::String(file_metadata.len().to_string()));
  } else {
    logger::log_to_file(app_handle.to_owned(), format!("Failed to parse {} with flac parser.", file_path.as_os_str().to_str().unwrap()).as_str(), 2);
  }
  
  return entry;
}

/// Reads a .mp3 file and returns the info.
fn read_mp3(app_handle: AppHandle, file_path: PathBuf) -> Map<String, Value> {
  let file_src = fs::File::open(file_path.to_owned()).expect("failed to open file");
  let file_metadata = file_src.metadata().unwrap();
  
  let mss = MediaSourceStream::new(Box::new(file_src), Default::default());
  let meta_opts: MetadataOptions = Default::default();
  let fmt_opts: FormatOptions = Default::default();

  let mut hint = Hint::new();
  hint.with_extension("mp3");
  
  let mut probed = symphonia::default::get_probe()
    .format(&hint, mss, &fmt_opts, &meta_opts)
    .expect("unsupported format");

  let mut tags = vec![];
  let mut visuals = vec![];
  if let Some(metadata_rev) = probed.format.metadata().current() {
    tags = metadata_rev.tags().to_owned();
    visuals = metadata_rev.visuals().to_owned();
  } else if let Some(metadata_rev) = probed.metadata.get().as_ref().and_then(|m| m.current()) {
    tags = metadata_rev.tags().to_owned();
    visuals = metadata_rev.visuals().to_owned();
  }

  let mut entry: Map<String, Value> = Map::new();

  for tag in tags {
    if !tag.key.eq_ignore_ascii_case("lyrics") {
      entry.insert(tag.key.to_ascii_lowercase().to_owned(), Value::String(tag.value.to_string()));
    }
  }

  for visual in visuals {
    let usage = visual.usage;
    
    if entry.contains_key("talb") {
      let album_title = entry.get("talb").unwrap().to_string();
      entry.insert(String::from("albumpath"), Value::String(write_visual_to_cache(app_handle.to_owned(), &visual, album_title)));
    } else if entry.contains_key("tal") {
      let album_title = entry.get("tal").unwrap().to_string();
      entry.insert(String::from("albumpath"), Value::String(write_visual_to_cache(app_handle.to_owned(), &visual, album_title)));
    } else {
      // entry.insert(String::from("albumpath"), Value::String());
      // println!("{}", write_visual_to_cache(app_handle.to_owned(), &visual, "test".to_owned()));
    }
  }

  let default_track = probed.format.default_track().unwrap();
  let code_params = &default_track.codec_params;
  entry.insert(String::from("bitrate"), Value::String(code_params.sample_rate.unwrap().to_string()));

  let time_base = code_params.time_base.unwrap();
  let num_framse = code_params.n_frames.unwrap();
  let length: symphonia::core::units::Time = TimeBase::calc_time(&time_base, num_framse);
  let time = length.seconds;
  let minutes = time / 60;
  let seconds = time % 60;

  let mut time_str = minutes.to_string();
  time_str.push_str(":");

  if seconds < 10 {
    time_str.push_str("0");
  }
  time_str.push_str(seconds.to_string().as_str());

  entry.insert(String::from("length"), Value::String(time_str));

  entry.insert(String::from("size"), Value::String(file_metadata.len().to_string()));
  
  return entry;
}

/// Reads a .wav file and returns the info.
fn read_wav(app_handle: AppHandle, file_path: PathBuf) -> Map<String, Value> {
  return Map::new();
}


/// Reads a music file and returns the info.
fn read_music_file(app_handle: AppHandle, file_path: PathBuf, file_type: String) -> Map<String, Value> {
  if file_type.eq_ignore_ascii_case("mp3") {
    return read_mp3(app_handle, file_path);
  } else if file_type.eq_ignore_ascii_case("flac") {
    return read_flac(app_handle, file_path);
  } else {
    return read_wav(app_handle, file_path);
  } 
}

/// Reads the content of the provided directory.
fn read_music_folder(app_handle: AppHandle, folder_path: PathBuf) -> Vec<Value> {
  let contents_res = fs::read_dir(folder_path.to_owned());
  
  let mut entries: Vec<Value> = vec![];

  if contents_res.is_ok() {
    let contents = contents_res.ok().unwrap();

    for file_entry_res in contents {
      let file_entry: DirEntry = file_entry_res.ok().expect("File entry should have been ok.");
      let file_path: PathBuf = file_entry.path();

      if file_path.is_dir() {
        let mut folder_entries = read_music_folder(app_handle.to_owned(), file_path.to_owned());
        entries.append(&mut folder_entries);
      } else {
        let file_type_str_res = file_path.extension();
        
        if file_type_str_res.is_some() {
          let file_type_str = file_type_str_res.unwrap().to_owned();
          let file_type = file_type_str.into_string().ok().expect("Should have been able to convert the file extension to a String.");
        
          if file_type.eq_ignore_ascii_case("mp3") || file_type.eq_ignore_ascii_case("flac") || file_type.eq_ignore_ascii_case("wav") {
            let mut file_entry = read_music_file(app_handle.to_owned(), file_path.to_owned(), file_type);
            
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
async fn read_music_folders(app_handle: AppHandle, music_folder_paths_str: String) -> String {
  let music_folder_paths: Vec<String> = serde_json::from_str(music_folder_paths_str.as_str()).expect("Should have been able to deserialize music folders array.");

  let mut entries: Vec<Value> = vec![];

  for music_folder in music_folder_paths {
    add_path_to_scope(app_handle.to_owned(), music_folder.to_owned()).await;
    let folder_path: PathBuf = PathBuf::from(music_folder.to_owned());

    let mut folder_entries = read_music_folder(app_handle.to_owned(), folder_path);
    entries.append(&mut folder_entries);
  }

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