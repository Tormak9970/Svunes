import { get } from "svelte/store";
import { albumsMap, artistsMap, genresMap, history, isPaused, nowPlayingList, nowPlayingType, playlists, playlistsMap, queue, showInfoSnackbar, songsMap } from "../../stores/State";
import { PlaybackController } from "./PlaybackController";
import { SettingsController } from "./SettingsController";
import { pluralize } from "../utils/Utils";

/**
 * Controls the current queue.
 */
export class QueueController {
  /**
   * Skips the current song.
   */
  static skip() {
    isPaused.set(false);
    let playbackHistory = get(history);
    let songQueue = get(queue);
    let songMap = get(songsMap);
    
    if (songQueue.length) {
      const skippedId = songQueue.shift();
      playbackHistory.push(skippedId!);

      PlaybackController.playSong(songMap[skippedId!], true);
      
      history.set(playbackHistory);
      queue.set(songQueue);
    } else {
      const playingType = get(nowPlayingType);
      const playingName = get(nowPlayingList);

      if (playingType === "Song") {
        PlaybackController.resetNowPlaying();
        return;
      }

      if (playingType === "Playlist") {
        PlaybackController.playPlaylist(get(playlistsMap)[playingName]);
        return;
      }

      if (playingType === "Album") {
        PlaybackController.playAlbum(get(albumsMap)[playingName]);
        return;
      }

      if (playingType === "Artist") {
        PlaybackController.playArtist(get(artistsMap)[playingName]);
        return;
      }

      if (playingType === "Genre") {
        PlaybackController.playGenre(get(genresMap)[playingName]);
        return;
      }
    }
  }

  /**
   * Skips back to the last song.
   */
  static skipBack() {
    isPaused.set(false);
    let playbackHistory = get(history);
    let songQueue = get(queue);
    let songMap = get(songsMap);

    if (playbackHistory.length) {
      let lastPlayedSongId = playbackHistory.pop();

      songQueue.unshift(lastPlayedSongId!);
      PlaybackController.playSong(songMap[lastPlayedSongId!], true);
      
      history.set(playbackHistory);
      queue.set(songQueue);
    }
  }

  /**
   * Checks the queue, and if its empty, plays the first playlist.
   * @param playlistIds The playlist ids to queue.
   */
  private static playPlaylistIfQueueEmpty(playlistIds: string[]) {
    let playlistMap = get(playlistsMap);

    if (get(queue).length === 0) {
      const firstPlaylistId = playlistIds.shift()!;
      const playlist = playlistMap[firstPlaylistId];
      PlaybackController.playPlaylist(playlist, true);
    }
  }

  /**
   * Checks the queue, and if its empty, plays the first song.
   * @param songIds The song ids to queue.
   */
  private static playSongIfQueueEmpty(songIds: string[]) {
    let songMap = get(songsMap);

    if (get(queue).length === 0) {
      const firstSongId = songIds.shift()!;
      const song = songMap[firstSongId];
      PlaybackController.playSong(song);
    }
  }

  /**
   * Checks the queue, and if its empty, plays the first album.
   * @param albumNames The album names to queue.
   */
  private static playAlbumIfQueueEmpty(albumNames: string[]) {
    let albumMap = get(albumsMap);

    if (get(queue).length === 0) {
      const firstName = albumNames.shift()!;
      const album = albumMap[firstName];
      PlaybackController.playAlbum(album, true);
    }
  }

  /**
   * Checks the queue, and if its empty, plays the first artist.
   * @param artistNames The artist names to queue.
   */
  private static playArtistIfQueueEmpty(artistNames: string[]) {
    let artistMap = get(artistsMap);

    if (get(queue).length === 0) {
      const firstName = artistNames.shift()!;
      const artist = artistMap[firstName];
      PlaybackController.playArtist(artist, true);
    }
  }

  /**
   * Checks the queue, and if its empty, plays the first genre.
   * @param genreNames The genre names to queue.
   */
  private static playGenreIfQueueEmpty(genreNames: string[]) {
    let genreMap = get(genresMap);

    if (get(queue).length === 0) {
      const firstName = genreNames.shift()!;
      const genre = genreMap[firstName];
      PlaybackController.playGenre(genre, true);
    }
  }

  /**
   * Queues the provided playlists.
   * @param playlistIds The playlist ids to queue.
   */
  static queuePlaylists(playlistIds: string[]) {
    const initialLength = playlistIds.length;
    this.playPlaylistIfQueueEmpty(playlistIds);
    
    let playlistMap = get(playlistsMap);
    let songQueue = get(queue);

    for (const playlistId of playlistIds) {
      const playlist = playlistMap[playlistId];
      playlist.numTimesPlayed++;
      playlist.setLastPlayed();
      
      for (const id of playlist.songIds) {
        songQueue.push(id);
      }
    }

    playlists.set([ ...get(playlists) ]);

    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("playlist", initialLength)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided songs.
   * @param songIds The song names to queue.
   */
  static queueSongs(songIds: string[]) {
    const initialLength = songIds.length;
    this.playSongIfQueueEmpty(songIds);
    
    let songQueue = get(queue);

    for (const id of songIds) {
      songQueue.push(id);
    }

    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("song", initialLength)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided albums.
   * @param albumNames The album names to queue.
   */
  static queueAlbums(albumNames: string[]) {
    const initialLength = albumNames.length;
    this.playAlbumIfQueueEmpty(albumNames);
    
    let albumMap = get(albumsMap);
    let songQueue = get(queue);

    for (const albumName of albumNames) {
      const album = albumMap[albumName];
      album.numTimesPlayed++;
      album.setLastPlayed();
      
      for (const id of album.songIds) {
        songQueue.push(id);
      }
    }

    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("album", initialLength)}`});
    
    SettingsController.updateAlbumsMetadata(albumNames.map((name) => albumMap[name]));
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided artists.
   * @param artistNames The artists names to queue.
   */
  static queueArtists(artistNames: string[]) {
    const initialLength = artistNames.length;
    this.playArtistIfQueueEmpty(artistNames);
    
    let artistMap = get(artistsMap);
    let songQueue = get(queue);

    for (const artistName of artistNames) {
      for (const id of artistMap[artistName].songIds) {
        songQueue.push(id);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("artist", initialLength)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided genres.
   * @param genreNames The genre names to queue.
   */
  static queueGenres(genreNames: string[]) {
    const initialLength = genreNames.length;
    this.playGenreIfQueueEmpty(genreNames);
    
    let genreMap = get(genresMap);
    let songQueue = get(queue);

    for (const genreName of genreNames) {
      for (const id of genreMap[genreName].songIds) {
        songQueue.push(id);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("genre", initialLength)}`});
    
    queue.set(songQueue);
  }

  /**
   * Dequeues the provided song.
   * @param songId The song id to dequeue.
   */
  static dequeueSong(songId: string) {
    let songQueue = get(queue);

    const songIndex = songQueue.findIndex((id) => id === songId);
    if (songIndex !== -1) songQueue.splice(songIndex, 1);
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided playlists right after the current song.
   * @param playlistIds The playlist ids to queue.
   */
  static playPlaylistsNext(playlistIds: string[]) {
    const initialLength = playlistIds.length;
    this.playPlaylistIfQueueEmpty(playlistIds);
    
    let playlistMap = get(playlistsMap);
    let songQueue = get(queue);

    for (const playlistId of playlistIds.reverse()) {
      const playlist = playlistMap[playlistId];
      playlist.numTimesPlayed++;
      playlist.setLastPlayed();
      
      for (const id of playlist.songIds.reverse()) {
        songQueue.unshift(id);
      }
    }

    playlists.set([ ...get(playlists) ]);
    
    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("playlist", initialLength)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided songs right after the current song.
   * @param songIds The song ids to queue.
   */
  static playSongsNext(songIds: string[]) {
    const initialLength = songIds.length;
    this.playSongIfQueueEmpty(songIds);
    
    let songQueue = get(queue);

    for (const songId of songIds.reverse()) {
      songQueue.unshift(songId);
    }
    
    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("song", initialLength)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided albums right after the current song.
   * @param albumNames The album names to queue.
   */
  static playAlbumsNext(albumNames: string[]) {
    const initialLength = albumNames.length;
    this.playAlbumIfQueueEmpty(albumNames);
    
    let albumMap = get(albumsMap);
    let songQueue = get(queue);

    for (const albumName of albumNames.reverse()) {
      const album = albumMap[albumName];
      album.numTimesPlayed++;
      album.setLastPlayed();
      
      for (const id of album.songIds.reverse()) {
        songQueue.unshift(id);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("album", initialLength)}`})

    SettingsController.updateAlbumsMetadata(albumNames.map((name) => albumMap[name]));
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided artists right after the current song.
   * @param artistNames The artists names to queue.
   */
  static playArtistsNext(artistNames: string[]) {
    const initialLength = artistNames.length;
    this.playArtistIfQueueEmpty(artistNames);
    
    let artistMap = get(artistsMap);
    let songQueue = get(queue);

    for (const artistName of artistNames.reverse()) {
      for (const id of artistMap[artistName].songIds.reverse()) {
        songQueue.unshift(id);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("artist", initialLength)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided genres right after the current song.
   * @param genreNames The genre names to queue.
   */
  static playGenresNext(genreNames: string[]) {
    const initialLength = genreNames.length;
    this.playGenreIfQueueEmpty(genreNames);
    
    let genreMap = get(genresMap);
    let songQueue = get(queue);

    for (const genreName of genreNames) {
      for (const id of genreMap[genreName].songIds) {
        songQueue.unshift(id);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${initialLength} ${pluralize("genre", initialLength)}`});
    
    queue.set(songQueue);
  }
}