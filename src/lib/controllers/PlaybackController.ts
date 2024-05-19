import type { Album } from "../models/Album";
import type { Artist } from "../models/Artist";
import type { Playlist } from "../models/Playlist";
import type { Song } from "../models/Song";
import { SettingsController } from "./SettingsController";

// ! Add logging to this file

/**
 * Controller that handles playback.
 */
export class PlaybackController {
  /**
   * Plays the provided playlist.
   * @param playlist The playlist to play.
   * @param shuffle Whether to shuffle this playlist or not.
   */
  static playPlaylist(playlist: Playlist, shuffle = false) {

  }

  /**
   * Plays the provided song.
   * @param song The song to play.
   */
  static playSong(song: Song) {
    SettingsController.updateSongMetadata(song);

  }
  
  /**
   * Plays the provided album.
   * @param album The album to play.
   * @param shuffle Whether to shuffle this album or not.
   */
  static playAlbum(album: Album, shuffle = false) {
    SettingsController.updateAlbumsMetadata([album]);
    
  }
  
  /**
   * Plays the provided artist.
   * @param artist The artist to play.
   * @param shuffle Whether to shuffle this artist or not.
   */
  static playArtist(artist: Artist, shuffle = false) {

  }

  /**
   * Pauses the playback.
   */
  static pause() {

  }

  /**
   * Resumes the playback.
   */
  static resume() {

  }
}