import { Album, Artist, Genre, Playlist, Song } from "@models";
import { showMiniPlayer, showNowPlaying } from "@stores/Overlays";
import { albums, isPaused, nowPlayingList, nowPlayingType, playingSongId, playlists, queue, shouldPauseOnEnd, shuffle, songProgress, songs, songsMap, trackHistory } from "@stores/State";
import { shuffleSongs } from "@utils";
import { get } from "svelte/store";
import { SettingsController } from "./utils/SettingsController";

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

  private static afterPlay() {
    if (!get(shouldPauseOnEnd)) {
      this.resume();
    } else {
      shouldPauseOnEnd.set(false);
    }
  }

  /**
   * Plays the provided playlist.
   * @param playlist The playlist to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playPlaylist(playlist: Playlist, ignoreShuffle = false) {
    if (playlist.songIds.length) {
      const songMap = get(songsMap);
      const shouldShuffle = get(shuffle);

      songProgress.set(0, false);
      nowPlayingList.set(playlist.id);
      nowPlayingType.set("Playlist");

      playlist.numTimesPlayed++;
      playlist.setLastPlayed();
      playlists.set([ ...get(playlists) ]);

      const cloned = structuredClone(playlist.songIds);
      const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
      const firstSongId = newQueue.shift()!;

      this.playSong(songMap[firstSongId], true);

      queue.set(newQueue);

      showNowPlaying.set(true);

      this.afterPlay();
    }
  }

  /**
   * Plays the provided song.
   * @param song The song to play.
   * @param isFromSkip Whether this is from skipping or a song ending.
   */
  static playSong(song: Song, isFromSkip = false) {
    songProgress.set(0, false);
    
    if (!isFromSkip) {
      nowPlayingList.set("");
      nowPlayingType.set("Song");
      showMiniPlayer.set(true);
    }

    song.numTimesPlayed++;
    if (get(trackHistory)) song.setLastPlayed();
    SettingsController.updateSongMetadata(song);
    songs.set([ ...get(songs) ]);

    playingSongId.set(song.id);

    showNowPlaying.set(true);

    this.afterPlay();
  }
  
  /**
   * Plays the provided album.
   * @param album The album to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playAlbum(album: Album, ignoreShuffle = false) {
    const shouldShuffle = get(shuffle);
    const songMap = get(songsMap);

    songProgress.set(0, false);
    nowPlayingList.set(album.name);
    nowPlayingType.set("Album");

    album.numTimesPlayed++;
    album.setLastPlayed();
    SettingsController.updateAlbumsMetadata([album]);
    albums.set([ ...get(albums) ]);
    
    const cloned = structuredClone(album.songIds);
    const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
    const firstSongId = newQueue.shift()!;

    this.playSong(songMap[firstSongId], true);

    queue.set(newQueue);
    
    showNowPlaying.set(true);
    showMiniPlayer.set(true);

    this.afterPlay();
  }
  
  /**
   * Plays the provided artist.
   * @param artist The artist to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playArtist(artist: Artist, ignoreShuffle = false) {
    const shouldShuffle = get(shuffle);
    const songMap = get(songsMap);

    songProgress.set(0, false);
    nowPlayingList.set(artist.name);
    nowPlayingType.set("Artist");
    
    const cloned = structuredClone(artist.songIds);
    const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
    const firstSongId = newQueue.shift()!;

    this.playSong(songMap[firstSongId], true);

    queue.set(newQueue);
    
    showNowPlaying.set(true);
    showMiniPlayer.set(true);
    
    this.afterPlay();
  }
  
  /**
   * Plays the provided genre.
   * @param genre The genre to play.
   * @param ignoreShuffle Whether to ignore the shuffle setting or not.
   */
  static playGenre(genre: Genre, ignoreShuffle = false) {
    const shouldShuffle = get(shuffle);
    const songMap = get(songsMap);

    songProgress.set(0, false);
    nowPlayingList.set(genre.name);
    nowPlayingType.set("Genre");
    
    const cloned = structuredClone(genre.songIds);
    const newQueue: string[] = (shouldShuffle && !ignoreShuffle) ? shuffleSongs(cloned) : cloned;
    const firstSongId = newQueue.shift()!;

    this.playSong(songMap[firstSongId], true);

    queue.set(newQueue);
    
    showNowPlaying.set(true);
    showMiniPlayer.set(true);

    this.afterPlay();
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