import { get } from "svelte/store";
import { songsMap } from "../../stores/State";
import { formatTime, getISODate } from "../utils/Utils";
import type { Song } from "./Song";

/**
 * Represents a user playlist.
 */
export class Playlist {
  name: string;
  imagePath?: string;
  songKeys: string[];
  albumArtLUT: Record<string, number>
  dateCreated: string;
  lastPlayedOn: string;
  numTimesPlayed: number;
  isUserPlaylist: boolean;
  pinned: boolean;

  /**
   * Creates a new playlist.
   */
  constructor(name: string, songKeys: string[], isUserPlaylist: boolean, albumArtLUT?: Record<string, number>, dateCreated?: string, lastPlayedOn?: string, numTimesPlayed?: number) {
    this.pinned = false;
    this.name = name;
    this.songKeys = songKeys;
    this.albumArtLUT = albumArtLUT ?? {};
    this.isUserPlaylist = isUserPlaylist;
    this.dateCreated = dateCreated ?? getISODate(new Date());
    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.numTimesPlayed = numTimesPlayed ?? 0;
  }
  
  get length() {
    const songKeysMap = get(songsMap);
    let totalLength = 0;

    for (const songKey of this.songKeys) {
      const song = songKeysMap[songKey];
      totalLength += song.length;
    }

    return totalLength;
  }

  /**
   * Sets the last played date to now.
   */
  setLastPlayed() {
    this.lastPlayedOn = getISODate(new Date());
  }

  /**
   * Displays the length of the playlist.
   */
  displayLength(): string {
    return formatTime(this.length);
  }

  /**
   * Updates the values associated with this song.
   * @param song The song to use.
   * @param oldAlbumName The song's old album name.
   */
  updateAssociatedValues(song: Song, oldAlbumName: string) {
    this.albumArtLUT[oldAlbumName] -= 1;

    if (this.albumArtLUT[oldAlbumName] === 0) {
      delete this.albumArtLUT[oldAlbumName];
    }

    if (song.album) {
      if (!this.albumArtLUT[song.album]) {
        this.albumArtLUT[song.album] = 1;
      } else {
        this.albumArtLUT[song.album] += 1;
      }
    }
  }

  /**
   * Removes a song from the playlist.
   * @param song The song to remove.
   */
  removeSong(song: Song) {
    const key = song.key;

    this.songKeys.splice(this.songKeys.indexOf(key), 1);

    if (song.album) {
      this.albumArtLUT[song.album] -= 1;

      if (this.albumArtLUT[song.album] === 0) {
        delete this.albumArtLUT[song.album];
      }
    }
  }
}