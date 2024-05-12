
/**
 * Represents an album.
 */
export class Album {
  name: string;
  artPath: string;
  trackCount: number;
  lastPlayedOn: string;
  artists: Set<string>;

  songNames: string[];
  
  releaseYear?: string;

  /**
   * Creates a new album object.
   */
  constructor(name: string, artPath: string, releaseYear?: string, lastPlayedOn?: string) {
    this.name = name;
    this.artPath = artPath;

    this.trackCount = 0;

    this.releaseYear = releaseYear;

    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.artists = new Set();
    this.songNames = [];
  }
}