import { get } from "svelte/store";
import { RustInterop } from "../controllers/RustInterop";
import { songsMap } from "../../stores/State";
import { formatTime, getISODate, sumColorString } from "../utils/Utils";

/**
 * Represents an album.
 */
export class Album {
  name: string;
  artPath: string | undefined;
  lastPlayedOn: string;
  _albumArtist: string | undefined;
  artists: Set<string>;
  genre?: string;
  numTimesPlayed: number;

  songKeys: string[];
  
  releaseYear: number;
  
  backgroundColor: string | undefined;

  /**
   * Creates a new album object.
   */
  constructor(name: string, artPath: string | undefined, albumArtist: string | undefined, releaseYear: number, genre?: string, lastPlayedOn?: string, numTimesPlayed?: number) {
    this.name = name;
    this.artPath = artPath;
    this._albumArtist = albumArtist;

    this.releaseYear = releaseYear;
    this.genre = genre;

    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.numTimesPlayed = numTimesPlayed ?? 0;
    this.songKeys = [];
    this.artists = new Set();
    
    this.backgroundColor = undefined;

    if (this.artPath) {
      RustInterop.getColorsFromImage(this.artPath).then((colors) => {
        if (colors.length) {
          let brightestColor = colors[0];
          let brightest = sumColorString(colors[0]);

          for (const color of colors) {
            const sum = sumColorString(color);
            if (sum > brightest) {
              brightest = sum;
              brightestColor = color;
            }
          }

          this.backgroundColor = brightestColor;
        }
      });
    }
  }

  get albumArtist(): string | undefined {
    return this._albumArtist ?? (this.artists.size === 1 ? Array.from(this.artists)[0] : undefined)
  }

  set albumArtist(artist: string | undefined) {
    this._albumArtist = artist;
  }

  get albumLength() {
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
   * Displays the length of the album.
   */
  displayAlbumLength(): string {
    return formatTime(this.albumLength);
  }
}