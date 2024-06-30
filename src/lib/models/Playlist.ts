import { songsMap } from "@stores/State";
import { get } from "svelte/store";
import { formatTime, hash64 } from "../utils/Utils";
import type { Song } from "./Song";

/**
 * Represents a user playlist.
 */
export class Playlist {
  private _id: string;
  pinned: boolean;
  name: string;
  description: string;
  imagePath?: string;
  songIds: string[];
  dateCreated: string;
  lastPlayedOn: string;
  numTimesPlayed: number;
  isUserPlaylist: boolean;

  /**
   * Creates a new playlist.
   */
  constructor(id: string | undefined, pinned: boolean, name: string, description: string, songIds: string[], isUserPlaylist: boolean, dateCreated?: string, lastPlayedOn?: string, numTimesPlayed?: number) {
    this.pinned = pinned;
    this.name = name;
    this.description = description;
    this.songIds = songIds;
    this.isUserPlaylist = isUserPlaylist;
    this.dateCreated = dateCreated ?? (new Date()).toISOString();
    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.numTimesPlayed = numTimesPlayed ?? 0;
    this._id = id ?? hash64(this.name);
  }
  
  get length() {
    const songMap = get(songsMap);
    let totalLength = 0;

    if (Object.keys(songMap).length > 0) {
      for (const id of this.songIds) {
        const song = songMap[id];
        totalLength += song.length;
      }
    }

    return totalLength;
  }

  get id() {
    return this._id;
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
    this.songIds.push(song.id);
  }

  /**
   * Removes a song from the playlist.
   * @param songId The id of the song to remove.
   */
  removeSong(songId: string) {
    this.songIds.splice(this.songIds.indexOf(songId), 1);
  }

  /**
   * Gets a playlist object from its json object.
   * @param json The playlist json object.
   * @returns The Playlist object.
   */
  static fromJSON(json: any): Playlist {
    return new Playlist(json._id, json.pinned, json.name, json.description, json.songIds, json.isUserPlaylist, json.dateCreated, json.lastPlayedOn, json.numTimesPlayed);
  }
}