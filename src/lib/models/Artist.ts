import { artistsMap, genresMap, songsMap } from "@stores/State";
import { checkChannels, checkGreyness, formatTime, sumColorString } from "@utils";
import { get } from "svelte/store";
import { RustInterop } from "../controllers/utils/RustInterop";

/**
 * Represents an Artist.
 */
export class Artist {
  name: string;
  imagePath: string | undefined;
  albumNames: Set<string>;
  genres: Set<string>;
  songIds: string[];
  
  backgroundColor: string | undefined;

  /**
   * Creates a new artist.
   */
  constructor(name: string, imagePath: string | undefined) {
    this.name = name;
    this.imagePath = imagePath;
    this.setBackgroundFromImage();
    this.albumNames = new Set();
    this.genres = new Set();
    this.songIds = [];
  }

  /**
   * Sets the primary color from the artist's image
   */
  async setBackgroundFromImage() {
    if (!this.imagePath) {
      this.backgroundColor = undefined;
      return;
    }

    await RustInterop.getColorsFromImage(this.imagePath).then((colors) => {
      if (colors.length) {
        this.backgroundColor = colors[0];

        if ((checkGreyness(this.backgroundColor, 20) || checkChannels(this.backgroundColor, 123)) && (sumColorString(colors[0]) < sumColorString(colors[1]))) {
          this.backgroundColor = colors[1];
        }
      }
    });
  }

  get artistSongsLength() {
    const songMap = get(songsMap);
    let totalLength = 0;

    for (const id of this.songIds) {
      const song = songMap[id];
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