import type { Album } from "../models/Album";
import type { Artist } from "../models/Artist";
import type { Playlist } from "../models/Playlist";
import type { Song } from "../models/Song";

// ! Add logging to this file

/**
 * Controller that handles playback.
 */
export class PlaybackController {
  /**
   * Plays the provided playlist.
   * @param playlist The playlist to play.
   */
  static playPlaylist(playlist: Playlist) {

  }

  /**
   * Plays the provided song.
   * @param song The song to play.
   */
  static playSong(song: Song) {

  }
  
  /**
   * Plays the provided album.
   * @param album The album to play.
   * @param shuffle Whether to shuffle this album or not.
   */
  static playAlbum(album: Album, shuffle = false) {

  }
  
  /**
   * Plays the provided artist.
   * @param artist The artist to play.
   */
  static playArtist(artist: Artist) {

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