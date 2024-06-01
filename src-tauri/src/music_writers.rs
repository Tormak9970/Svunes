use std::path::PathBuf;
use id3::{frame::Picture, Frame, TagLike};
use metaflac;
use tauri::AppHandle;
use image::io::Reader as ImageReader;

use crate::logger;

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[allow(non_snake_case)]
pub struct SongEditFields {
  artPath: Option<String>,
  title: Option<String>,
  album: Option<String>,
  composer: Option<String>,
  albumArtist: Option<String>,
  artist: Option<String>,
  releaseYear: Option<i32>,
  genre: Option<String>,
  trackNumber: Option<u16>
}

fn get_image_data(app_handle: AppHandle, image_path: String) -> Vec<u8> {
  let image_reader_res = ImageReader::open(image_path.to_owned());
  
  if image_reader_res.is_ok() {
    let image_reader = image_reader_res.ok().unwrap();

    let image_res = image_reader.decode();

    if image_res.is_ok() {
      let img = image_res.ok().unwrap();
      return img.as_bytes().to_owned();
    } else {
      logger::log_to_file(app_handle.to_owned(), format!("failed to decode {}.", image_path).as_str(), 2);
      return vec![];
    }
  } else {
    logger::log_to_file(app_handle.to_owned(), format!("failed to read {}.", image_path).as_str(), 2);
    return vec![];
  }
}

/// Sets a flac meta tag.
fn set_flac_tag(tag: &mut metaflac::Tag, key: &str, value: &str) {
  tag.vorbis_comments_mut().set(key, vec![value]);
}

/// Removes a flag meta tag.
fn remove_flac_tag(tag: &mut metaflac::Tag, key: &str) {
  tag.vorbis_comments_mut().comments.remove(key);
}

// Writes changes to a flac file.
fn write_flac_file(app_handle: AppHandle, file_path: String, edited_fields: SongEditFields) -> bool {
  let mut tag = metaflac::Tag::read_from_path(file_path.clone()).expect("Unsupported file format.");

  if edited_fields.artPath.is_some() {
    let image_path = edited_fields.artPath.unwrap();
    let data = get_image_data(app_handle.clone(), image_path.clone());

    if data.len() > 0 {
      tag.remove_picture_type(metaflac::block::PictureType::CoverFront);

      let mut mime = "image/jpeg";
      if image_path.to_lowercase().ends_with(".png") {
        mime = "image/png";
      }
  
      let picture_type = metaflac::block::PictureType::CoverFront;
  
      tag.add_picture(mime, picture_type, data.to_owned());
    }
  } else {
    tag.remove_picture_type(metaflac::block::PictureType::CoverFront);
  }

  if edited_fields.title.is_some() {
    let title = edited_fields.title.unwrap();
    set_flac_tag(&mut tag, "TITLE", &title);
  } else {
    remove_flac_tag(&mut tag, "TITLE");
  }
  
  if edited_fields.album.is_some() {
    let album = edited_fields.album.unwrap();
    set_flac_tag(&mut tag, "ALBUM", &album);
  } else {
    remove_flac_tag(&mut tag, "ALBUM");
  }
  
  if edited_fields.composer.is_some() {
    let composer = edited_fields.composer.unwrap();
    set_flac_tag(&mut tag, "COMPOSER", &composer);
  } else {
    remove_flac_tag(&mut tag, "COMPOSER");
  }
  
  if edited_fields.albumArtist.is_some() {
    let album_artist = edited_fields.albumArtist.unwrap();
    set_flac_tag(&mut tag, "ALBUMARTIST", &album_artist);
  } else {
    remove_flac_tag(&mut tag, "ALBUMARTIST");
  }
  
  if edited_fields.artist.is_some() {
    let artist = edited_fields.artist.unwrap();
    set_flac_tag(&mut tag, "ARTIST", &artist);
  } else {
    remove_flac_tag(&mut tag, "ARTIST");
  }
  
  if edited_fields.releaseYear.is_some() {
    let release_year = edited_fields.releaseYear.unwrap();
    set_flac_tag(&mut tag, "YEAR", &release_year.to_string());
  } else {
    remove_flac_tag(&mut tag, "YEAR");
    remove_flac_tag(&mut tag, "DATE");
  }
  
  if edited_fields.genre.is_some() {
    let genre = edited_fields.genre.unwrap();
    set_flac_tag(&mut tag, "GENRE", &genre);
  } else {
    remove_flac_tag(&mut tag, "GENRE");
  }
  
  if edited_fields.trackNumber.is_some() {
    let track_number = edited_fields.trackNumber.unwrap();
    set_flac_tag(&mut tag, "TRACKNUMBER", &track_number.to_string());
  } else {
    remove_flac_tag(&mut tag, "TRACKNUMBER");
  }

  let result = tag.write_to_path(&file_path);

  if result.is_err() {
    let err = result.err().unwrap();
    logger::log_to_file(app_handle.to_owned(), format!("Failed to save {}: {}", &file_path, err.to_string()).as_str(), 0);
    return false;
  }

  return true;
}

// Writes changes to a mp3 file.
fn write_mp3_file(app_handle: AppHandle, file_path: String, edited_fields: SongEditFields) -> bool {
  let mut tag = id3::Tag::read_from_path(file_path.clone()).expect("Unsupported file format.");

  if edited_fields.artPath.is_some() {
    let image_path = edited_fields.artPath.unwrap();
    let data = get_image_data(app_handle.clone(), image_path.clone());

    if data.len() > 0 {
      tag.remove_picture_by_type(id3::frame::PictureType::CoverFront);

      let mut mime = "image/jpeg";
      if image_path.to_lowercase().ends_with(".png") {
        mime = "image/png";
      }
  
      tag.add_frame(Picture {
        mime_type: mime.to_owned(),
        picture_type: id3::frame::PictureType::CoverFront,
        description: "".to_owned(),
        data: data.to_owned()
      });
    }
  } else {
    tag.remove_picture_by_type(id3::frame::PictureType::CoverFront);
  }

  if edited_fields.title.is_some() {
    let title = edited_fields.title.unwrap();
    tag.set_title(&title);
  } else {
    tag.remove_title();
  }
  
  if edited_fields.album.is_some() {
    let album = edited_fields.album.unwrap();
    tag.set_album(&album);
  } else {
    tag.remove_album();
  }
  
  if edited_fields.composer.is_some() {
    let composer = edited_fields.composer.unwrap();
    tag.add_frame(Frame::text("TCOM", composer));
  } else {
    tag.remove("TCOM");
  }
  
  if edited_fields.albumArtist.is_some() {
    let album_artist = edited_fields.albumArtist.unwrap();
    tag.set_album_artist(&album_artist);
  } else {
    tag.remove_album_artist();
  }
  
  if edited_fields.artist.is_some() {
    let artist = edited_fields.artist.unwrap();
    tag.set_artist(&artist);
  } else {
    tag.remove_artist();
  }
  
  if edited_fields.releaseYear.is_some() {
    let release_year = edited_fields.releaseYear.unwrap();
    tag.set_year(release_year);
  } else {
    tag.remove_date_recorded();
    tag.remove_year();
  }
  
  if edited_fields.genre.is_some() {
    let genre = edited_fields.genre.unwrap();
    tag.set_genre(&genre);
  } else {
    tag.remove_genre();
  }
  
  if edited_fields.trackNumber.is_some() {
    let track_number = edited_fields.trackNumber.unwrap();
    tag.set_track(track_number.into());
  } else {
    tag.remove_track();
  }

  let result = tag.write_to_path(&file_path, tag.version());

  if result.is_err() {
    let err = result.err().unwrap();
    logger::log_to_file(app_handle.to_owned(), format!("Failed to save {}: {}", &file_path, err.to_string()).as_str(), 0);
    return false;
  }

  return true;
}

// Writes changes to a music file.
pub fn write_music_file(app_handle: AppHandle, file_path: String, edited_fields: SongEditFields) -> bool {
  let file_path_buf = PathBuf::from(&file_path);
  let file_type = file_path_buf.extension().expect("Couldn't get file extension for song.");
  
  if file_type.eq_ignore_ascii_case("mp3") {
    return write_mp3_file(app_handle, file_path, edited_fields);
  } else {
    return write_flac_file(app_handle, file_path, edited_fields);
  }
}