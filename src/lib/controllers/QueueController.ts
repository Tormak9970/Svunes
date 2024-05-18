import { get } from "svelte/store";
import { albums, albumsMap, artists, artistsMap, queue, songsMap } from "../../stores/State";
import { PlaybackController } from "./PlaybackController";

// ! Add logging to this file
// ! search file for "TODO"

/**
 * Controls the current queue.
 */
export class QueueController {
  private static history: string[];

  static skip() {
    let songQueue = get(queue);
    
    if (songQueue.length) {
      const skippedSong = songQueue.shift();
      this.history.push(skippedSong!.key);

      PlaybackController.playSong(songQueue[0]);
      queue.set(songQueue);
    }
  }

  static skipBack() {

  }

  /**
   * Queues the provided playlists.
   * @param playlistNames The playlist names to queue.
   */
  static queuePlaylists(playlistNames: string[]) {
    
  }

  /**
   * Queues the provided songs.
   * @param songKeys The song names to queue.
   */
  static queueSongs(songKeys: string[]) {
    let songMap = get(songsMap);
    let songQueue = get(queue);

    for (const songKey of songKeys) {
      songQueue.push(songMap[songKey]);
    }
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided albums.
   * @param albumNames The album names to queue.
   */
  static queueAlbums(albumNames: string[]) {
    let songMap = get(songsMap);
    let albumMap = get(albumsMap);
    let songQueue = get(queue);

    for (const albumName of albumNames.reverse()) {
      const album = albumMap[albumName];
      album.setLastPlayed();
      
      for (const songName of album.songKeys) {
        songQueue.push(songMap[songName]);
      }
    }

    // TODO: verify that this will include the changed date
    albums.set([ ...get(albums) ]);
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided artists.
   * @param artistNames The artists names to queue.
   */
  static queueArtists(artistNames: string[]) {
    let songMap = get(songsMap);
    let artistMap = get(artistsMap);
    let songQueue = get(queue);

    for (const artistName of artistNames.reverse()) {
      for (const songName of artistMap[artistName].songKeys) {
        songQueue.push(songMap[songName]);
      }
    }
    
    queue.set(songQueue);
  }

  /**
   * Dequeues the provided song.
   * @param songKey The song key to dequeue.
   */
  static dequeueSong(songKey: string) {
    let songQueue = get(queue);

    const songIndex = songQueue.findIndex((song) => song.key === songKey);
    if (songIndex !== -1) songQueue.splice(songIndex, 1);
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided playlists right after the current song.
   * @param playlistNames The playlist names to queue.
   */
  static playPlaylistsNext(playlistNames: string[]) {
    
  }

  /**
   * Queues the provided songs right after the current song.
   * @param songKeys The song keys to queue.
   */
  static playSongsNext(songKeys: string[]) {
    let songMap = get(songsMap);
    let songQueue = get(queue);

    for (const songKey of songKeys.reverse()) {
      songQueue.unshift(songMap[songKey]);
    }
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided albums right after the current song.
   * @param albumNames The album names to queue.
   */
  static playAlbumsNext(albumNames: string[]) {
    let songMap = get(songsMap);
    let albumMap = get(albumsMap);
    let songQueue = get(queue);

    for (const albumName of albumNames.reverse()) {
      const album = albumMap[albumName];
      album.setLastPlayed();
      
      for (const songKey of album.songKeys) {
        songQueue.unshift(songMap[songKey]);
      }
    }

    // TODO: verify that this will include the changed date
    albums.set([ ...get(albums) ]);
    
    queue.set(songQueue);
  }

  /**
   * Queues the provided artists right after the current song.
   * @param artistNames The artists names to queue.
   */
  static playArtistsNext(artistNames: string[]) {
    let songMap = get(songsMap);
    let artistMap = get(artistsMap);
    let songQueue = get(queue);

    for (const artistName of artistNames.reverse()) {
      for (const songKey of artistMap[artistName].songKeys) {
        songQueue.unshift(songMap[songKey]);
      }
    }
    
    queue.set(songQueue);
  }
}