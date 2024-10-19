/**
 * Sums the components of a color.
 * @param color The color to sum.
 * @returns The some of the color's components.
 */
export function sumColorString(color: string): number {
  const parts = color.split(" ").map((part) => parseInt(part));
  return parts[0] + parts[1] + parts[2];
}

/**
 * Determines if a given color is close to grey.
 * @param color The color to check.
 * @param threshold The closeness to grey.
 * @returns True if the color is close to grey.
 */
export function checkGreyness(color: string, threshold: number): boolean {
  const parts = color.split(" ").map((part) => parseInt(part));
  const closeness = ((parts[0] - parts[1]) + (parts[1] - parts[2]) + (parts[0] - parts[2])) / 3;
  return Math.abs(closeness) <= threshold;
}

/**
 * Determines if a given color's channels are too dim.
 * @param color The color to check.
 * @param threshold The channel threshold.
 */
export function checkChannels(color: string, threshold: number): boolean {
  const parts = color.split(" ").map((part) => parseInt(part));
  return parts.every((channel) => channel < threshold);
}

/**
 * Gets a rgb value from an argb value.
 * @param argb The argb value.
 * @returns The rgb representation (red, green, blue).
 */
export function rgbFromArgb(argb: number): string {
  const red = (argb >> 16) & 255;
  const green = (argb >> 8) & 255;
  const blue = argb & 255;

  return `${red}, ${green}, ${blue}`;
}