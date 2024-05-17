import { get } from "svelte/store";
import { RustInterop } from "../controllers/RustInterop";
import { songsMap } from "../../stores/State";
import { formatTime, getISODate } from "../utils/Utils";

/**
 * Represents an album.
 */
export class Album {
  name: string;
  artPath: string | undefined;
  lastPlayedOn: string;
  artists: Set<string>;
  genre?: string;

  songNames: string[];
  
  releaseYear: number;
  
  backgroundColor: string;
  color: string;

  /**
   * Creates a new album object.
   */
  constructor(name: string, artPath: string | undefined, releaseYear: number, genre?: string, lastPlayedOn?: string) {
    this.name = name;
    this.artPath = artPath;

    this.releaseYear = releaseYear;
    this.genre = genre;

    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.artists = new Set();
    this.songNames = [];
    
    // TODO: figure out css vars for this
    this.backgroundColor = "black";
    this.color = "red";

    if (this.artPath) {
      RustInterop.getColorsFromImage(this.artPath).then((colors) => {
        if (colors.length) {
          this.backgroundColor = colors[0];
          this.color = colors[1];
        }
      });
    }
  }

  get albumLength() {
    const songNamesMap = get(songsMap);
    let totalLength = 0;

    for (const songName of this.songNames) {
      const song = songNamesMap[songName];
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
   * Displays the length of the song.
   */
  displayAlbumLength(): string {
    return formatTime(this.albumLength);
  }

  /**
   * Displays the album's artists.
   */
  displayArtists(): string | undefined {
    return this.artists.size > 0 ? Array.from(this.artists.values()).join(", ") : undefined;
  }
}