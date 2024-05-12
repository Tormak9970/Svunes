/**
 * Represents an Artist.
 */
export class Artist {
  name: string;
  albumNames: Set<string>;
  songNames: string[];

  /**
   * Creates a new artist.
   */
  constructor(name: string) {
    this.name = name;
    this.albumNames = new Set();
    this.songNames = [];
  }
}