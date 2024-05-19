import { get } from "svelte/store";
import { artistsMap, genresMap, songsMap } from "../../stores/State";
import { formatTime, sumColorString } from "../utils/Utils";
import { RustInterop } from "../controllers/RustInterop";

/**
 * Represents an Artist.
 */
export class Artist {
  name: string;
  _imagePath: string | undefined;
  albumNames: Set<string>;
  genres: Set<string>;
  songKeys: string[];
  
  backgroundColor: string | undefined;

  /**
   * Creates a new artist.
   */
  constructor(name: string, imagePath: string | undefined) {
    this.name = name;
    this.imagePath = imagePath;
    this.albumNames = new Set();
    this.genres = new Set();
    this.songKeys = [];
  }

  get imagePath(): string | undefined {
    return this._imagePath;
  }

  set imagePath(path: string | undefined) {
    this._imagePath = path;
    
    if (this._imagePath) {
      RustInterop.getColorsFromImage(this._imagePath).then((colors) => {
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

  get artistSongsLength() {
    const songKeysMap = get(songsMap);
    let totalLength = 0;

    for (const songKey of this.songKeys) {
      const song = songKeysMap[songKey];
      totalLength += song.length;
    }

    return totalLength;
  }

  get similarArtists(): Artist[] {
    if (this.genres.size > 0) {
      const artistMap = get(artistsMap);
      const genreMap = get(genresMap);
      const genresList = Array.from(this.genres).map((name) => genreMap[name]);
      const genreArtistNames = Array.from(new Set(genresList.map((genre) => Array.from(genre.artists)).flat())).filter((name) => name !== this.name);
      return genreArtistNames.map((name) => artistMap[name]);
    }

    return [];
  }

  /**
   * Displays the length of the artist's song.
   */
  displayArtistSongLength(): string {
    return formatTime(this.artistSongsLength);
  }
}