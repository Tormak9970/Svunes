import { RustInterop } from "../controllers/RustInterop";

/**
 * Represents a Genre.
 */
export class Genre {
  name: string;
  imagePreviewPath: string;
  songNames: string[];
  backgroundColor: string;
  color: string;

  /**
   * Creates a new Genre.
   */
  constructor(name: string, imagePreviewPath: string) {
    this.name = name;
    this.imagePreviewPath = imagePreviewPath;
    this.songNames = [];
    
    // TODO: figure out css vars for this
    this.backgroundColor = "black";
    this.color = "red";

    RustInterop.getColorsFromImage(this.imagePreviewPath).then((colors) => {
      if (colors.length) {
        this.backgroundColor = colors[0];
        this.color = colors[1];
      }
    });
  }
}