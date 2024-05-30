import { get } from "svelte/store";
import { songsMap } from "../../stores/State";
import { formatTime } from "../utils/Utils";
import type { Song } from "./Song";

/**
 * Represents a user playlist.
 */
export class Playlist {
  pinned: boolean;
  name: string;
  description: string;
  imagePath?: string;
  songKeys: string[];
  dateCreated: string;
  lastPlayedOn: string;
  numTimesPlayed: number;
  isUserPlaylist: boolean;

  /**
   * Creates a new playlist.
   */
  constructor(pinned: boolean, name: string, description: string, songKeys: string[], isUserPlaylist: boolean, dateCreated?: string, lastPlayedOn?: string, numTimesPlayed?: number) {
    this.pinned = pinned;
    this.name = name;
    this.description = description;
    this.songKeys = songKeys;
    this.isUserPlaylist = isUserPlaylist;
    this.dateCreated = dateCreated ?? (new Date()).toISOString();
    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.numTimesPlayed = numTimesPlayed ?? 0;
  }
  
  get length() {
    const songMap = get(songsMap);
    let totalLength = 0;

    if (Object.keys(songMap).length > 0) {
      for (const songKey of this.songKeys) {
        const song = songMap[songKey];
        totalLength += song.length;
      }
    }

    return totalLength;
  }

  /**
   * Sets the last played date to now.
   */
  setLastPlayed() {
    this.lastPlayedOn = (new Date()).toISOString();
  }

  /**
   * Displays the length of the playlist.
   */
  displayLength(): string {
    return formatTime(this.length);
  }

  /**
   * Adds a song from the playlist.
   * @param song The song to add.
   */
  addSong(song: Song) {
    this.songKeys.push(song.key);
  }

  /**
   * Removes a song from the playlist.
   * @param songKey The key of the song to remove.
   */
  removeSong(songKey: string) {
    this.songKeys.splice(this.songKeys.indexOf(songKey), 1);
  }

  /**
   * Gets a playlist object from its json object.
   * @param json The playlist json object.
   * @returns The Playlist object.
   */
  static fromJSON(json: any): Playlist {
    return new Playlist(json.pinned, json.name, json.description, json.songKeys, json.isUserPlaylist, json.dateCreated, json.lastPlayedOn, json.numTimesPlayed);
  }
}