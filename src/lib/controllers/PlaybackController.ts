import { get } from "svelte/store";
import { isPaused, nowPlayingList, nowPlayingType, playingSongId, playlists, queue, shuffle, songProgress } from "../../stores/State";
import type { Album } from "../models/Album";
import type { Artist } from "../models/Artist";
import type { Playlist } from "../models/Playlist";
import type { Song } from "../models/Song";
import { SettingsController } from "./SettingsController";
import type { Genre } from "../models/Genre";
import { shuffleSongs } from "../utils/Shuffle";
import { showMiniPlayer, showNowPlaying } from "../../stores/Overlays";

/**
 * Controller that handles playback.
 */
export class PlaybackController {
  /**
   * Resets the now playing stores.
   */
  static resetNowPlaying() {
    showMiniPlayer.set(false);
    showNowPlaying.set(false);
    songProgress.set(0);
    playingSongId.set("");
    queue.set([]);
    nowPlayingList.set("");
    nowPlayingType.set("Song");
    PlaybackController.pause();
  }

  /**
   * Plays the provided playlist.
   * @param playlist The playlist to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playPlaylist(playlist: Playlist, ignoreShuffle = false) {
    if (playlist.songIds.length) {
      const shouldShuffle = get(shuffle);

      songProgress.set(0);
      nowPlayingList.set(playlist.id);
      nowPlayingType.set("Playlist");

      playlist.numTimesPlayed++;
      playlist.setLastPlayed();
      playlists.set([ ...get(playlists) ]);

      const cloned = structuredClone(playlist.songIds);
      const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
      const firstSongId = newQueue.shift()!;

      playingSongId.set(firstSongId);

      queue.set(newQueue);

      showNowPlaying.set(true);
      showMiniPlayer.set(true);

      this.resume();
    }
  }

  /**
   * Plays the provided song.
   * @param song The song to play.
   * @param isFromSkip Whether this is from skipping or a song ending.
   */
  static playSong(song: Song, isFromSkip = false) {
    songProgress.set(0);
    
    if (!isFromSkip) {
      nowPlayingList.set("");
      nowPlayingType.set("Song");
    }

    song.numTimesPlayed++;
    song.setLastPlayed();
    SettingsController.updateSongMetadata(song);

    playingSongId.set(song.id);

    showNowPlaying.set(true);
    showMiniPlayer.set(true);

    this.resume();
  }
  
  /**
   * Plays the provided album.
   * @param album The album to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playAlbum(album: Album, ignoreShuffle = false) {
    const shouldShuffle = get(shuffle);

    songProgress.set(0);
    nowPlayingList.set(album.name);
    nowPlayingType.set("Album");

    album.numTimesPlayed++;
    album.setLastPlayed();
    SettingsController.updateAlbumsMetadata([album]);
    
    const cloned = structuredClone(album.songIds);
    const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
    const firstSongId = newQueue.shift()!;

    playingSongId.set(firstSongId);

    queue.set(newQueue);
    
    showNowPlaying.set(true);
    showMiniPlayer.set(true);

    this.resume();
  }
  
  /**
   * Plays the provided artist.
   * @param artist The artist to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playArtist(artist: Artist, ignoreShuffle = false) {
    const shouldShuffle = get(shuffle);

    songProgress.set(0);
    nowPlayingList.set(artist.name);
    nowPlayingType.set("Artist");
    
    const cloned = structuredClone(artist.songIds);
    const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
    const firstSongId = newQueue.shift()!;

    playingSongId.set(firstSongId);

    queue.set(newQueue);
    
    showNowPlaying.set(true);
    showMiniPlayer.set(true);
    
    this.resume();
  }
  
  /**
   * Plays the provided genre.
   * @param genre The genre to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playGenre(genre: Genre, ignoreShuffle = false) {
    const shouldShuffle = get(shuffle);

    songProgress.set(0);
    nowPlayingList.set(genre.name);
    nowPlayingType.set("Genre");
    
    const cloned = structuredClone(genre.songIds);
    const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
    const firstSongId = newQueue.shift()!;

    playingSongId.set(firstSongId);

    queue.set(newQueue);
    
    showNowPlaying.set(true);
    showMiniPlayer.set(true);

    this.resume();
  }

  /**
   * Pauses the playback.
   */
  static pause() {
    isPaused.set(true);
  }

  /**
   * Resumes the playback.
   */
  static resume() {
    isPaused.set(false);
  }
}