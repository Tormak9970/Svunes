import { get } from "svelte/store";
import { RustInterop } from "../controllers/utils/RustInterop";
import { songsMap } from "../../stores/State";
import { formatTime } from "../utils/Utils";
import { checkChannels, checkGreyness, sumColorString } from "../utils/Colors";

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

  songIds: string[];
  
  releaseYear: number;
  
  backgroundColor: string | undefined;

  /**
   * Creates a new album object.
   */
  constructor(name: string, artPath: string | undefined, albumArtist: string | undefined, releaseYear: number, genre?: string, lastPlayedOn?: string, numTimesPlayed?: number) {
    this.name = name;
    this.artPath = artPath;
    this.setBackgroundFromImage();
    this._albumArtist = albumArtist;

    this.releaseYear = releaseYear;
    this.genre = genre;

    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.numTimesPlayed = numTimesPlayed ?? 0;
    this.songIds = [];
    this.artists = new Set();
  }

  /**
   * Sets the primary color from the album's image
   */
  async setBackgroundFromImage() {
    if (this.artPath) {
      await RustInterop.getColorsFromImage(this.artPath).then((colors) => {
        if (colors.length) {
          this.backgroundColor = colors[0];

          if ((checkGreyness(this.backgroundColor, 20) || checkChannels(this.backgroundColor, 123)) && (sumColorString(colors[0]) < sumColorString(colors[1]))) {
            this.backgroundColor = colors[1];
          }
        }
      });
    } else {
      this.backgroundColor = undefined;
    }
  }

  get albumArtist(): string | undefined {
    return this._albumArtist ?? (this.artists.size === 1 ? Array.from(this.artists)[0] : undefined)
  }

  set albumArtist(artist: string | undefined) {
    this._albumArtist = artist;
  }

  get albumLength() {
    const songMap = get(songsMap);
    let totalLength = 0;

    for (const id of this.songIds) {
      const song = songMap[id];
      totalLength += song.length;
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
   * Displays the length of the album.
   */
  displayAlbumLength(): string {
    return formatTime(this.albumLength);
  }
}