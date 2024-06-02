use std::{fs, path::PathBuf, sync::mpsc::Sender};
use id3::{frame::Picture, no_tag_ok, Frame, TagLike};
use metaflac;

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

/// Sets a flac meta tag.
fn set_flac_tag(tag: &mut metaflac::Tag, key: &str, value: &str) {
  tag.vorbis_comments_mut().set(key, vec![value]);
}

/// Removes a flag meta tag.
fn remove_flac_tag(tag: &mut metaflac::Tag, key: &str) {
  tag.vorbis_comments_mut().comments.remove(key);
}

// Writes changes to a flac file.
fn write_flac_file(log_sender: &mut Sender<String>, file_path: String, edited_fields: SongEditFields) -> bool {
  let tag_res = metaflac::Tag::read_from_path(file_path.clone());

  if tag_res.is_err() {
    let err = tag_res.err().unwrap();
    let _ = log_sender.send(format!("Failed to open {}: {}", &file_path, err.to_string()));
    return false;
  }
  let mut tag = tag_res.unwrap();

  if edited_fields.artPath.is_some() {
    let image_path = edited_fields.artPath.unwrap();
    let data_res = fs::read(image_path.clone());

    if data_res.is_err() {
      let err = data_res.err().unwrap();
      let _ = log_sender.send(format!("Failed to read {}: {}", &file_path, err.to_string()));
      return false;
    }

    let data = data_res.ok().unwrap();

    if data.len() > 0 {
      tag.remove_picture_type(metaflac::block::PictureType::CoverFront);
      tag.remove_picture_type(metaflac::block::PictureType::Other);
      tag.remove_picture_type(metaflac::block::PictureType::OtherIcon);

      let mut mime = "image/jpeg";
      if file_path.to_ascii_lowercase().ends_with(".png") {
        mime = "image/png";
      }
  
      tag.add_picture(mime, metaflac::block::PictureType::CoverFront, data.to_owned());
    }
  } else {
    tag.remove_picture_type(metaflac::block::PictureType::CoverFront);
    tag.remove_picture_type(metaflac::block::PictureType::Other);
    tag.remove_picture_type(metaflac::block::PictureType::OtherIcon);
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
    let _ = log_sender.send(format!("Failed to save {}: {}", &file_path, err.to_string()));
    return false;
  }

  return true;
}

// Writes changes to a mp3 file.
fn write_mp3_file(log_sender: &mut Sender<String>, file_path: String, edited_fields: SongEditFields) -> bool {
  let tag_res = no_tag_ok(id3::Tag::read_from_path(file_path.clone()));

  let mut tag: id3::Tag;

  if tag_res.is_err() {
    let err = tag_res.err().unwrap();
    let _ = log_sender.send(format!("Failed to open {}: {}", &file_path, err.to_string()));
    return false;
  }

  let tag_opt = tag_res.unwrap();

  if tag_opt.is_some() {
    tag = tag_opt.unwrap();
  } else {
    tag = id3::Tag::new();
  }

  if edited_fields.artPath.is_some() {
    let image_path = edited_fields.artPath.unwrap();
    let data_res = fs::read(image_path.clone());

    if data_res.is_err() {
      let err = data_res.err().unwrap();
      let _ = log_sender.send(format!("Failed to read {}: {}", &file_path, err.to_string()));
      return false;
    }

    let data = data_res.ok().unwrap();

    if data.len() > 0 {
      tag.remove_picture_by_type(id3::frame::PictureType::CoverFront);
      tag.remove_picture_by_type(id3::frame::PictureType::Other);
      tag.remove_picture_by_type(id3::frame::PictureType::OtherIcon);

      let mut mime = "image/jpeg";
      if file_path.to_ascii_lowercase().ends_with(".png") {
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
    tag.remove_picture_by_type(id3::frame::PictureType::Other);
    tag.remove_picture_by_type(id3::frame::PictureType::OtherIcon);
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
    let _ = log_sender.send(format!("Failed to save {}: {}", &file_path, err.to_string()));
    return false;
  }

  return true;
}

// Writes changes to a music file.
pub fn write_music_file(log_sender: &mut Sender<String>, file_path: String, edited_fields: SongEditFields) -> bool {
  let file_path_buf = PathBuf::from(&file_path);
  let file_type = file_path_buf.extension().expect("Couldn't get file extension for song.");
  
  if file_type.eq_ignore_ascii_case("mp3") {
    return write_mp3_file(log_sender, file_path, edited_fields);
  } else {
    return write_flac_file(log_sender, file_path, edited_fields);
  }
}