import { get } from "svelte/store";
import { queue, songsMap } from "../../stores/State";
import { PlaybackController } from "./PlaybackController";

// ! Add logging to this file

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
   * Queues the provided songs right after the current song.
   * @param songNames The song names to queue.
   */
  static playNext(songNames: string[]) {
    let songMap = get(songsMap);
    let songQueue = get(queue);

    for (const songName of songNames.reverse()) {
      songQueue.unshift(songMap[songName]);
    }
    
    queue.set(songQueue);
  }
}