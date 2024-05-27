import { get } from "svelte/store";
import { playlists } from "../../stores/State";
import type { Album } from "../models/Album";
import type { Artist } from "../models/Artist";
import type { Playlist } from "../models/Playlist";
import type { Song } from "../models/Song";
import { SettingsController } from "./SettingsController";
import type { Genre } from "../models/Genre";

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
    playlist.numTimesPlayed++;
    playlist.setLastPlayed();
    playlists.set([ ...get(playlists) ]);
  }

  /**
   * Plays the provided song.
   * @param song The song to play.
   */
  static playSong(song: Song) {
    song.numTimesPlayed++;
    song.setLastPlayed();
    SettingsController.updateSongMetadata(song);

  }
  
  /**
   * Plays the provided album.
   * @param album The album to play.
   * @param shuffle Whether to shuffle this album or not.
   */
  static playAlbum(album: Album, shuffle = false) {
    album.numTimesPlayed++;
    album.setLastPlayed();
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
   * Plays the provided genre.
   * @param genre The genre to play.
   */
  static playGenre(genre: Genre) {

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