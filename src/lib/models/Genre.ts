/**
 * Represents a Genre.
 */
export class Genre {
  name: string;
  imagePreviewPath: string | undefined;
  songKeys: string[];
  artists: Set<string>;
  backgroundColor: string | undefined;
  textColor: string | undefined;

  /**
   * Creates a new Genre.
   */
  constructor(name: string, imagePreviewPath: string | undefined) {
    this.name = name;
    this.imagePreviewPath = imagePreviewPath;
    this.songKeys = [];
    this.artists = new Set();
  }
}