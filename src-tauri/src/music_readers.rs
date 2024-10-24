
use std::{fs::{create_dir_all, read_dir, DirEntry, File}, io::{Error, Write}, path::PathBuf, sync::mpsc::Sender};

use serde_json::{Map, Value};
use symphonia::{core::{codecs::CodecRegistry, formats::{FormatOptions, FormatReader}, io::MediaSourceStream, meta::{MetadataOptions, Visual}, probe::{Hint, Probe}, units::TimeBase}, default::{formats::FlacReader, register_enabled_codecs}};
use symphonia_metadata::id3v2::Id3v2Reader;
use tauri::{AppHandle, Manager};

use crate::{logger, symphonia_mock::mpa_reader::MpaReader};

/// Formats the album name for the album image cache.
pub fn format_album_name_for_image(album_title: String) -> String {
  let mut file_name = album_title.to_owned();
  file_name = file_name.replace(&[':'][..], "");
  return file_name;
}

/// Writes the album visual to the cache folder and returns the path
fn write_visual_to_cache(app_handle: &AppHandle, visual: &Visual, album_title: String) -> String {
  let bundle_id: String = app_handle.config().identifier.to_owned();
  
  let app_cache_dir = app_handle.path().cache_dir().expect("Couldn't resolve app cache dir.");
  let mut file_path = app_cache_dir.join(&bundle_id).join("albums");

  if !file_path.exists() {
    let _ = create_dir_all(file_path.to_owned());
  }

  let file_type;
  let lower_case = visual.media_type.to_ascii_lowercase();
  let png_header: Vec<u8> = vec![137, 80, 78, 71, 13, 10, 26, 10, 0];
  let mut data: Vec<u8> = vec![];

  if visual.media_type.contains("/") {
    file_type = &visual.media_type[6..];
  } else if lower_case.eq_ignore_ascii_case("PNG") {
    // ! this accounts for symphonia messing up when the MIME is just "PNG"
    file_type = &lower_case;
    data = png_header;
  } else {
    file_type = &lower_case;
  }

  data = [data, visual.data.clone().into_vec()].concat();

  let name_no_quotes = (&album_title[1..album_title.len() - 1]).to_owned();
  let mut file_name = format_album_name_for_image(name_no_quotes);
  file_name.push_str(".");
  file_name.push_str(file_type);

  file_path = file_path.join(file_name.to_owned());

  if !file_path.exists() {
    let mut dest_file: File = File::create(&file_path).expect("Dest path should have existed.");
    let write_res = dest_file.write_all(data.as_ref());

    if write_res.is_ok() {
      logger::log(app_handle, format!("Writing of {} finished.", file_name).as_str(), 0);
    } else {
      let err = write_res.err().unwrap();
      logger::log(app_handle, format!("Writing of {} failed with {}.", file_name, err.to_string()).as_str(), 0);
    }
  }

  return file_path.as_mut_os_string().to_str().expect("failed to parse file path!!").to_owned();
}

/// Reads a .flac file and returns the info.
fn read_flac(app_handle: &AppHandle, file_path: PathBuf, max_length: u64) -> Map<String, Value> {
  let file_src = File::open(file_path.to_owned()).expect("failed to open file");
  let file_metadata = file_src.metadata().unwrap();
  
  let mss = MediaSourceStream::new(Box::new(file_src), Default::default());
  let fmt_opts: FormatOptions = Default::default();

  let flac_reader_res = FlacReader::try_new(mss, &fmt_opts);

  let mut entry: Map<String, Value> = Map::new();

  if flac_reader_res.is_ok() {
    let mut flac_reader = flac_reader_res.ok().unwrap();

    let default_track = flac_reader.default_track().unwrap();
    let code_params = &default_track.codec_params;

    let time_base = code_params.time_base.unwrap();
    let num_frames = code_params.n_frames.unwrap();
    let length: symphonia::core::units::Time = TimeBase::calc_time(&time_base, num_frames);

    if length.seconds > max_length {
      return Map::new();
    }

    entry.insert(String::from("length"), Value::String(length.seconds.to_string()));


    let sample_rate = code_params.sample_rate.unwrap();
    let bits_per_sample = code_params.bits_per_sample.unwrap();
    let channels = code_params.channels.unwrap();
    let bit_rate = u64::from(bits_per_sample * sample_rate) * u64::try_from(channels.count()).unwrap();

    entry.insert(String::from("bitrate"), Value::String(bit_rate.to_string()));
    entry.insert(String::from("samplerate"), Value::String(sample_rate.to_string()));


    entry.insert(String::from("size"), Value::String(file_metadata.len().to_string()));


    let mut metadata = flac_reader.metadata();

    let newest_res = metadata.skip_to_latest();

    if newest_res.is_some() {
      let newest = newest_res.unwrap();
      let tags = newest.tags();

      for tag in tags {
        if !tag.key.eq_ignore_ascii_case("lyrics") && !tag.key.eq_ignore_ascii_case("lyricist") {
          entry.insert(tag.key.to_ascii_lowercase().to_owned(), Value::String(tag.value.to_string()));
        }
      }
      
      let visuals = newest.visuals();
      
      let album_title = entry.get("album").unwrap().to_string();

      for visual in visuals {
        let album_art_path = write_visual_to_cache(app_handle, visual, album_title.clone());

        if !entry.contains_key("albumpath") {
          entry.insert(String::from("albumpath"), Value::String(album_art_path));
        }
      }
    }
  } else {
    logger::log(app_handle, format!("Failed to parse {} with flac parser.", file_path.as_os_str().to_str().unwrap()).as_str(), 2);
  }
  
  return entry;
}

/// Reads a .mp3 file and returns the info.
fn read_mp3(app_handle: &AppHandle, file_path: PathBuf, max_length: u64) -> Map<String, Value> {
  let file_src = File::open(file_path.to_owned()).expect("failed to open file");
  let file_metadata = file_src.metadata().unwrap();
  let mut entry: Map<String, Value> = Map::new();
  
  let mss = MediaSourceStream::new(Box::new(file_src), Default::default());
  let meta_opts: MetadataOptions = Default::default();
  let fmt_opts: FormatOptions = Default::default();

  let mut hint = Hint::new();
  hint.with_extension("mp3");

  let mut registry = CodecRegistry::default();
  register_enabled_codecs(&mut registry);

  let mut probe = Probe::default();
  probe.register_all::<MpaReader>();
  probe.register_all::<Id3v2Reader>();

  let mut probed = probe.format(&hint, mss, &fmt_opts, &meta_opts).expect("unsupported format");

  let default_track = probed.format.default_track().unwrap();
  let code_params = &default_track.codec_params;

  let time_base = code_params.time_base.unwrap();
  let num_frames = code_params.n_frames.unwrap();
  let length: symphonia::core::units::Time = TimeBase::calc_time(&time_base, num_frames);

  if length.seconds > max_length {
    return Map::new();
  }

  entry.insert(String::from("length"), Value::String(length.seconds.to_string()));


  let sample_rate = code_params.sample_rate.unwrap();
  let bit_rate = code_params.bits_per_sample.unwrap();

  entry.insert(String::from("bitrate"), Value::String(bit_rate.to_string()));
  entry.insert(String::from("samplerate"), Value::String(sample_rate.to_string()));


  let file_size = file_metadata.len();
  entry.insert(String::from("size"), Value::String(file_size.to_string()));
    

  let mut tags = vec![];
  let mut visuals = vec![];
  // if let Some(metadata_rev) = probed.format.metadata().current() {
  //   tags = metadata_rev.tags().to_owned();
  //   visuals = metadata_rev.visuals().to_owned();
  // } else 
  if let Some(metadata_rev) = probed.metadata.get().as_ref().and_then(|m| m.current()) {
    tags = metadata_rev.tags().to_owned();
    visuals = metadata_rev.visuals().to_owned();
  }

  for tag in tags {
    if !tag.key.eq_ignore_ascii_case("lyrics") {
      entry.insert(tag.key.to_ascii_lowercase().to_owned(), Value::String(tag.value.to_string()));
    }
  }

  for visual in visuals {
    if entry.contains_key("talb") {
      let album_title = entry.get("talb").unwrap().to_string();
      entry.insert(String::from("albumpath"), Value::String(write_visual_to_cache(app_handle, &visual, album_title)));
    } else if entry.contains_key("tal") {
      let album_title = entry.get("tal").unwrap().to_string();
      entry.insert(String::from("albumpath"), Value::String(write_visual_to_cache(app_handle, &visual, album_title)));
    } else {
      // entry.insert(String::from("albumpath"), Value::String());
      // println!("{}", write_visual_to_cache(app_handle.to_owned(), &visual, "test".to_owned()));
    }
  }
  
  return entry;
}

/// Reads a music file and returns the info.
fn read_music_file(app_handle: &AppHandle, file_path: PathBuf, file_type: String, max_length: u64) -> Map<String, Value> {
  if file_type.eq_ignore_ascii_case("mp3") {
    return read_mp3(app_handle, file_path, max_length);
  } else {
    return read_flac(app_handle, file_path, max_length);
  }
}

/// Reads the content of the provided directory.
pub fn read_music_folder(app_handle: &AppHandle, log_sender: &mut Sender<String>, folder_path: PathBuf, blacklist: &[String], max_length: u64) -> Vec<Value> {
  let contents_res = read_dir(folder_path.to_owned());
  
  let mut entries: Vec<Value> = vec![];

  if contents_res.is_err() {
    let err: Error = contents_res.err().unwrap();
    let _ = log_sender.send(format!("Encountered error while reading {}. Error: {}", folder_path.to_owned().to_str().unwrap(), err.to_string()));
    return entries;
  }

  let contents = contents_res.ok().unwrap();
    
  let mut sub_dirs: Vec<PathBuf> = vec![];

  for file_entry_res in contents {
    let file_entry: DirEntry = file_entry_res.ok().expect("File entry should have been ok.");
    let file_path: PathBuf = file_entry.path();
    let file_path_str = file_path.as_os_str().to_str().unwrap().to_owned();

    if file_path.is_dir() && !blacklist.contains(&file_path_str) {
      sub_dirs.push(file_path);
    } else {
      let file_type_str_res = file_path.extension();
      
      if file_type_str_res.is_some() {
        let file_type_str = file_type_str_res.unwrap().to_owned();
        let file_type = file_type_str.into_string().ok().expect("Should have been able to convert the file extension to a String.");
      
        if file_type.eq_ignore_ascii_case("mp3") || file_type.eq_ignore_ascii_case("flac") {
          let mut file_entry = read_music_file(app_handle, file_path.to_owned(), file_type, max_length);
          
          if !file_entry.is_empty() {
            file_entry.insert(String::from("filename"), Value::String(file_path_str));
            entries.push(Value::Object(file_entry));
          }
        }
      }
    }
  }

  for directory_path in sub_dirs {
    let mut folder_entries = read_music_folder(app_handle, log_sender, directory_path.to_owned(), blacklist, max_length);
    entries.append(&mut folder_entries);
  }
  
  return entries;
}
