/**
 * Represents an Artist.
 */
export class Artist {
  name: string;
  imagePath: string | undefined;
  albumNames: Set<string>;
  genres: Set<string>;
  songKeys: string[];

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
}