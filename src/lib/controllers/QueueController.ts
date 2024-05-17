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
      this.history.push(skippedSong!.title);

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
   * @param songNames The song names to queue.
   */
  static queueSongs(songNames: string[]) {
    let songMap = get(songsMap);
    let songQueue = get(queue);

    for (const songName of songNames) {
      songQueue.push(songMap[songName]);
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
      
      for (const songName of album.songNames) {
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
      for (const songName of artistMap[artistName].songNames) {
        songQueue.push(songMap[songName]);
      }
    }
    
    queue.set(songQueue);
  }

  /**
   * Dequeues the provided song.
   * @param songName The song name to dequeue.
   */
  static dequeueSong(songName: string) {
    let songQueue = get(queue);

    const songIndex = songQueue.findIndex((song) => song.title === songName);
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
   * @param songNames The song names to queue.
   */
  static playSongsNext(songNames: string[]) {
    let songMap = get(songsMap);
    let songQueue = get(queue);

    for (const songName of songNames.reverse()) {
      songQueue.unshift(songMap[songName]);
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
      
      for (const songName of album.songNames) {
        songQueue.unshift(songMap[songName]);
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
      for (const songName of artistMap[artistName].songNames) {
        songQueue.unshift(songMap[songName]);
      }
    }
    
    queue.set(songQueue);
  }
}