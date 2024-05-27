import { get } from "svelte/store";
import { artistsMap, genresMap, songsMap } from "../../stores/State";
import { formatTime } from "../utils/Utils";
import { checkChannels, checkGreyness, sumColorString } from "../utils/Colors";
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
    
    if (path) {
      RustInterop.getColorsFromImage(path).then((colors) => {
        if (colors.length) {
          this.backgroundColor = colors[0];

          if ((checkGreyness(this.backgroundColor, 20) || checkChannels(this.backgroundColor, 123)) && (sumColorString(colors[0]) < sumColorString(colors[1]))) {
            this.backgroundColor = colors[1];
          }
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