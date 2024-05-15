import { RustInterop } from "../controllers/RustInterop";

/**
 * Represents an album.
 */
export class Album {
  name: string;
  artPath: string;
  lastPlayedOn: string;
  artists: Set<string>;

  songNames: string[];
  
  releaseYear?: number;
  
  backgroundColor: string;
  color: string;

  /**
   * Creates a new album object.
   */
  constructor(name: string, artPath: string, releaseYear?: number, lastPlayedOn?: string) {
    this.name = name;
    this.artPath = artPath;

    this.releaseYear = releaseYear;

    this.lastPlayedOn = lastPlayedOn ?? "Never";
    this.artists = new Set();
    this.songNames = [];
    
    // TODO: figure out css vars for this
    this.backgroundColor = "black";
    this.color = "red";

    RustInterop.getColorsFromImage(this.artPath).then((colors) => {
      if (colors.length) {
        this.backgroundColor = colors[0];
        this.color = colors[1];
      }
    });
  }
}