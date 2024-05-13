import { getISODate } from "../utils/Utils";

/**
 * Represents a user playlist.
 */
export class Playlist {
  name: string;
  songNames: string[];
  dateCreated: string;
  lastPlayedOn: string;

  /**
   * Creates a new playlist.
   */
  constructor(name: string, songNames: string[], dateCreated?: string, lastPlayedOn?: string) {
    this.name = name;
    this.songNames = songNames;
    this.dateCreated = dateCreated ?? getISODate(new Date());
    this.lastPlayedOn = lastPlayedOn ?? "Never";
  }
}