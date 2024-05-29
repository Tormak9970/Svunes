import { get } from "svelte/store";
import { playlists, shuffle } from "../../stores/State";
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
   */
  static playPlaylist(playlist: Playlist) {
    const shouldShuffle = get(shuffle);
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
   */
  static playAlbum(album: Album) {
    const shouldShuffle = get(shuffle);
    album.numTimesPlayed++;
    album.setLastPlayed();
    SettingsController.updateAlbumsMetadata([album]);
    
  }
  
  /**
   * Plays the provided artist.
   * @param artist The artist to play.
   */
  static playArtist(artist: Artist) {
    const shouldShuffle = get(shuffle);

  }
  
  /**
   * Plays the provided genre.
   * @param genre The genre to play.
   */
  static playGenre(genre: Genre) {
    const shouldShuffle = get(shuffle);

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