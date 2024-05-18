/**
 * Represents an Artist.
 */
export class Artist {
  name: string;
  imagePath: string | undefined;
  albumNames: Set<string>;
  songKeys: string[];

  /**
   * Creates a new artist.
   */
  constructor(name: string, imagePath: string | undefined) {
    this.name = name;
    this.imagePath = imagePath;
    this.albumNames = new Set();
    this.songKeys = [];
  }
}