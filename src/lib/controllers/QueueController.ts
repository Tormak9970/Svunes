import { get } from "svelte/store";
import { albumsMap, artistsMap, playlists, playlistsMap, queue, showInfoSnackbar, songsMap } from "../../stores/State";
import { PlaybackController } from "./PlaybackController";
import { SettingsController } from "./SettingsController";
import { pluralize } from "../utils/Utils";

// ! Add logging to this file

/**
 * Controls the current queue.
 */
export class QueueController {
  private static history: string[];

  /**
   * Skips the current song.
   */
  static skip() {
    let songQueue = get(queue);
    let songMap = get(songsMap);
    
    if (songQueue.length) {
      const skippedKey = songQueue.shift();
      this.history.push(skippedKey!);

      PlaybackController.playSong(songMap[skippedKey!]);
      queue.set(songQueue);
    }
  }

  /**
   * Skips back to the last song.
   */
  static skipBack() {
    let songQueue = get(queue);
    let songMap = get(songsMap);

    if (this.history.length > 0) {
      let lastPlayedSongKey = this.history.pop();

      songQueue.unshift(lastPlayedSongKey!);
      PlaybackController.playSong(songMap[lastPlayedSongKey!]);
      
      queue.set(songQueue);
    } else {
      // TODO: disable back button if history is length 0
    }
  }

  /**
   * Queues the provided playlists.
   * @param playlistNames The playlist names to queue.
   */
  static queuePlaylists(playlistNames: string[]) {
    let playlistMap = get(playlistsMap);
    let songQueue = get(queue);

    for (const playlistName of playlistNames) {
      const playlist = playlistMap[playlistName];
      playlist.numTimesPlayed++;
      playlist.setLastPlayed();
      
      for (const songKey of playlist.songKeys) {
        songQueue.push(songKey);
      }
    }

    playlists.set([ ...get(playlists) ]);

    get(showInfoSnackbar)({ message: `Queued ${playlistNames.length} ${pluralize("playlist", playlistNames.length)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided songs.
   * @param songKeys The song names to queue.
   */
  static queueSongs(songKeys: string[]) {
    let songQueue = get(queue);

    for (const songKey of songKeys) {
      songQueue.push(songKey);
    }

    get(showInfoSnackbar)({ message: `Queued ${songKeys.length} ${pluralize("song", songKeys.length)}`});
    
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
      
      for (const songKey of album.songKeys) {
        songQueue.push(songKey);
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
      for (const songKey of artistMap[artistName].songKeys) {
        songQueue.push(songKey);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${artistNames.length} ${pluralize("artist", artistNames.length)}`});
    
    queue.set(songQueue);
  }

  /**
   * Dequeues the provided song.
   * @param songKey The song key to dequeue.
   */
  static dequeueSong(songKey: string) {
    let songQueue = get(queue);

    const songIndex = songQueue.findIndex((key) => key === songKey);
    if (songIndex !== -1) songQueue.splice(songIndex, 1);
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided playlists right after the current song.
   * @param playlistNames The playlist names to queue.
   */
  static playPlaylistsNext(playlistNames: string[]) {
    let playlistMap = get(playlistsMap);
    let songQueue = get(queue);

    for (const playlistName of playlistNames.reverse()) {
      const playlist = playlistMap[playlistName];
      playlist.numTimesPlayed++;
      playlist.setLastPlayed();
      
      for (const songKey of playlist.songKeys.reverse()) {
        songQueue.unshift(songKey);
      }
    }

    playlists.set([ ...get(playlists) ]);
    
    get(showInfoSnackbar)({ message: `Queued ${playlistNames.length} ${pluralize("playlist", playlistNames.length)}`});
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided songs right after the current song.
   * @param songKeys The song keys to queue.
   */
  static playSongsNext(songKeys: string[]) {
    let songQueue = get(queue);

    for (const songKey of songKeys.reverse()) {
      songQueue.unshift(songKey);
    }
    
    get(showInfoSnackbar)({ message: `Queued ${songKeys.length} ${pluralize("song", songKeys.length)}`});
    
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
      
      for (const songKey of album.songKeys.reverse()) {
        songQueue.unshift(songKey);
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
      for (const songKey of artistMap[artistName].songKeys.reverse()) {
        songQueue.unshift(songKey);
      }
    }
    
    get(showInfoSnackbar)({ message: `Queued ${artistNames.length} ${pluralize("artist", artistNames.length)}`});
    
    queue.set(songQueue);
  }
}