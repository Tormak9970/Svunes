import { RustInterop } from "../controllers/RustInterop";
import { sumColorString } from "../utils/Utils";

/**
 * Represents a Genre.
 */
export class Genre {
  name: string;
  imagePreviewPath: string | undefined;
  songKeys: string[];
  artists: Set<string>;
  backgroundColor: string | undefined;

  /**
   * Creates a new Genre.
   */
  constructor(name: string, imagePreviewPath: string | undefined) {
    this.name = name;
    this.imagePreviewPath = imagePreviewPath;
    this.songKeys = [];
    this.artists = new Set();
    
    this.backgroundColor = undefined;

    if (this.imagePreviewPath) {
      RustInterop.getColorsFromImage(this.imagePreviewPath).then((colors) => {
        if (colors.length) {
          let brightestColor = colors[0];
          let brightest = sumColorString(colors[0]);

          for (const color of colors) {
            const sum = sumColorString(color);
            if (sum > brightest) {
              brightest = sum;
              brightestColor = color;
            }
          }

          this.backgroundColor = brightestColor;
        }
      });
    }
  }
}