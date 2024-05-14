
use std::{fs::{create_dir_all, File}, io::Write, path::PathBuf};

use serde_json::{Map, Value};
use symphonia::{core::{codecs::CodecRegistry, formats::{FormatOptions, FormatReader}, io::MediaSourceStream, meta::{MetadataOptions, Visual}, probe::{Hint, Probe}, units::TimeBase}, default::{formats::FlacReader, register_enabled_codecs}};
use symphonia_metadata::id3v2::Id3v2Reader;
use tauri::{api::path::cache_dir, AppHandle};

use crate::{logger, mpa_reader::MpaReader};

/// Writes the album visual to the cache folder and returns the path
pub fn write_visual_to_cache(app_handle: AppHandle, visual: &Visual, album_title: String) -> String {
  let bundle_id: String = app_handle.config().tauri.bundle.identifier.to_owned();
  
  let app_cache_dir = cache_dir().expect("Couldn't resolve app cache dir.");
  let mut file_path = app_cache_dir.join(&bundle_id).join("albums");

  if !file_path.exists() {
    let _ = create_dir_all(file_path.to_owned());
  }

  let file_type;
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
pub fn read_flac(app_handle: AppHandle, file_path: PathBuf) -> Map<String, Value> {
  let file_src = File::open(file_path.to_owned()).expect("failed to open file");
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

      for tag in tags {
        if !tag.key.eq_ignore_ascii_case("lyrics") && !tag.key.eq_ignore_ascii_case("lyricist") {
          entry.insert(tag.key.to_ascii_lowercase().to_owned(), Value::String(tag.value.to_string()));
        }
      }
      
      let visuals = newest.visuals();

      for visual in visuals {
        let album_title = entry.get("album").unwrap().to_string();
        entry.insert(String::from("albumpath"), Value::String(write_visual_to_cache(app_handle.to_owned(), visual, album_title)));
      }
    }

    let default_track = flac_reader.default_track().unwrap();
    let code_params = &default_track.codec_params;

    let sample_rate = code_params.sample_rate.unwrap();
    let bits_per_sample = code_params.bits_per_sample.unwrap();
    let bit_rate = bits_per_sample * sample_rate;

    entry.insert(String::from("bitrate"), Value::String(bit_rate.to_string()));
    entry.insert(String::from("samplerate"), Value::String(sample_rate.to_string()));

    let time_base = code_params.time_base.unwrap();
    let num_frames = code_params.n_frames.unwrap();
    let length: symphonia::core::units::Time = TimeBase::calc_time(&time_base, num_frames);
    entry.insert(String::from("length"), Value::String(length.seconds.to_string()));

    entry.insert(String::from("size"), Value::String(file_metadata.len().to_string()));
  } else {
    logger::log_to_file(app_handle.to_owned(), format!("Failed to parse {} with flac parser.", file_path.as_os_str().to_str().unwrap()).as_str(), 2);
  }
  
  return entry;
}

/// Reads a .mp3 file and returns the info.
pub fn read_mp3(app_handle: AppHandle, file_path: PathBuf) -> Map<String, Value> {
  let file_src = File::open(file_path.to_owned()).expect("failed to open file");
  let file_metadata = file_src.metadata().unwrap();
  
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
  let sample_rate = code_params.sample_rate.unwrap();
  let bit_rate = code_params.bits_per_sample.unwrap();

  entry.insert(String::from("bitrate"), Value::String(bit_rate.to_string()));
  entry.insert(String::from("samplerate"), Value::String(sample_rate.to_string()));

  let time_base = code_params.time_base.unwrap();
  let num_frames = code_params.n_frames.unwrap();
  let length: symphonia::core::units::Time = TimeBase::calc_time(&time_base, num_frames);
  entry.insert(String::from("length"), Value::String(length.seconds.to_string()));

  let file_size = file_metadata.len();
  entry.insert(String::from("size"), Value::String(file_size.to_string()));
  
  return entry;
}

/// Reads a .wav file and returns the info.
pub fn read_wav(_app_handle: AppHandle, _file_path: PathBuf) -> Map<String, Value> {
  return Map::new();
}