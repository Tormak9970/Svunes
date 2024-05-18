import { RustInterop } from "../controllers/RustInterop";

/**
 * Represents a Genre.
 */
export class Genre {
  name: string;
  imagePreviewPath: string | undefined;
  songKeys: string[];
  backgroundColor: string;
  color: string;

  /**
   * Creates a new Genre.
   */
  constructor(name: string, imagePreviewPath: string | undefined) {
    this.name = name;
    this.imagePreviewPath = imagePreviewPath;
    this.songKeys = [];
    
    // TODO: figure out css vars for this
    this.backgroundColor = "black";
    this.color = "red";

    if (this.imagePreviewPath) {
      RustInterop.getColorsFromImage(this.imagePreviewPath).then((colors) => {
        if (colors.length) {
          this.backgroundColor = colors[0];
          this.color = colors[1];
        }
      });
    }
  }
}