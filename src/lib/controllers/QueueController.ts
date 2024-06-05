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

      PlaybackController.playSong(songMap[skippedId!]);
      
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
      PlaybackController.playSong(songMap[lastPlayedSongId!]);
      
      history.set(playbackHistory);
      queue.set(songQueue);
    }
  }

  /**
   * Queues the provided playlists.
   * @param playlistIds The playlist ids to queue.
   */
  static queuePlaylists(playlistIds: string[]) {
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

    get(showInfoSnackbar)({ message: `Queued ${playlistIds.length} ${pluralize("playlist", playlistIds.length)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided songs.
   * @param songIds The song names to queue.
   */
  static queueSongs(songIds: string[]) {
    let songQueue = get(queue);

    for (const id of songIds) {
      songQueue.push(id);
    }

    get(showInfoSnackbar)({ message: `Queued ${songIds.length} ${pluralize("song", songIds.length)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided albums.
   * @param albumNames The album names to queue.
   */
  static queueAlbums(albumNames: string[]) {
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

    get(showInfoSnackbar)({ message: `Queued ${albumNames.length} ${pluralize("album", albumNames.length)}`});
    
    SettingsController.updateAlbumsMetadata(albumNames.map((name) => albumMap[name]));
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided artists.
   * @param artistNames The artists names to queue.
   */
  static queueArtists(artistNames: string[]) {
    let artistMap = get(artistsMap);
    let songQueue = get(queue);

    for (const artistName of artistNames) {
      for (const id of artistMap[artistName].songIds) {
        songQueue.push(id);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${artistNames.length} ${pluralize("artist", artistNames.length)}`});
    
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
    
    get(showInfoSnackbar)({ message: `Queued ${playlistIds.length} ${pluralize("playlist", playlistIds.length)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided songs right after the current song.
   * @param songIds The song ids to queue.
   */
  static playSongsNext(songIds: string[]) {
    let songQueue = get(queue);

    for (const songId of songIds.reverse()) {
      songQueue.unshift(songId);
    }
    
    get(showInfoSnackbar)({ message: `Queued ${songIds.length} ${pluralize("song", songIds.length)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided albums right after the current song.
   * @param albumNames The album names to queue.
   */
  static playAlbumsNext(albumNames: string[]) {
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
    
    get(showInfoSnackbar)({ message: `Queued ${albumNames.length} ${pluralize("album", albumNames.length)}`})

    SettingsController.updateAlbumsMetadata(albumNames.map((name) => albumMap[name]));
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided artists right after the current song.
   * @param artistNames The artists names to queue.
   */
  static playArtistsNext(artistNames: string[]) {
    let artistMap = get(artistsMap);
    let songQueue = get(queue);

    for (const artistName of artistNames.reverse()) {
      for (const id of artistMap[artistName].songIds.reverse()) {
        songQueue.unshift(id);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${artistNames.length} ${pluralize("artist", artistNames.length)}`});
    
    queue.set(songQueue);
  }
}