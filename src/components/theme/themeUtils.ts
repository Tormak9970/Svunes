import { argbFromRgb, DynamicScheme, MaterialDynamicColors, SchemeTonalSpot } from "@material/material-color-utilities";

type Color =
  | "primary"
  | "onPrimary"
  | "primaryContainer"
  | "onPrimaryContainer"
  | "inversePrimary"
  | "secondary"
  | "onSecondary"
  | "secondaryContainer"
  | "onSecondaryContainer"
  | "tertiary"
  | "onTertiary"
  | "tertiaryContainer"
  | "onTertiaryContainer"
  | "error"
  | "onError"
  | "errorContainer"
  | "onErrorContainer"
  | "background"
  | "onBackground"
  | "surface"
  | "onSurface"
  | "surfaceVariant"
  | "onSurfaceVariant"
  | "inverseSurface"
  | "inverseOnSurface"
  | "outline"
  | "outlineVariant"
  | "shadow"
  | "scrim"
  | "surfaceDim"
  | "surfaceBright"
  | "surfaceContainerLowest"
  | "surfaceContainerLow"
  | "surfaceContainer"
  | "surfaceContainerHigh"
  | "surfaceContainerHighest"
  | "surfaceTint";

// const pairs = [
//   ["primary", "onPrimary"],
//   ["primaryContainer", "onPrimaryContainer"],
//   ["secondary", "onSecondary"],
//   ["secondaryContainer", "onSecondaryContainer"],
//   ["tertiary", "onTertiary"],
//   ["tertiaryContainer", "onTertiaryContainer"],
//   ["background", "onBackground"],
//   ["surface", "onSurface"],
//   ["inverseSurface", "inverseOnSurface"],
//   ["surfaceVariant", "onSurfaceVariant"],
//   ["error", "onError"],
//   ["errorContainer", "onErrorContainer"],
// ]

export const colors: Color[] = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "inversePrimary",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "inverseSurface",
  "inverseOnSurface",
  "outline",
  "outlineVariant",
  "shadow",
  "scrim",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "surfaceTint",
];

export type SerializedScheme = Record<Color, number>;

/**
 * Generates the CSS color variable for the provided color.
 * @param name The name of the color.
 * @param argb The argb value.
 * @returns The CSS variable.
 */
function genColorVariable(name: string, argb: number) {
  const kebabCase = name.replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`);
  const red = (argb >> 16) & 255;
  const green = (argb >> 8) & 255;
  const blue = argb & 255;
  return `--m3-scheme-${kebabCase}: ${red} ${green} ${blue};`;
}

function getOledDarkColors(scheme: SerializedScheme): [string, number][] {
  scheme.background = argbFromRgb(0, 0, 0);
  
  scheme.onBackground = argbFromRgb(234, 244, 247);
  
  scheme.shadow = argbFromRgb(0, 0, 0);
  
  scheme.surface = argbFromRgb(0, 0, 0);
  scheme.surfaceContainer = argbFromRgb(17, 19, 21);
  scheme.surfaceContainerHigh = argbFromRgb(39, 37, 42);
  scheme.surfaceContainerHighest = argbFromRgb(48, 52, 57);
  scheme.surfaceContainerLow = argbFromRgb(16, 18, 19);
  scheme.surfaceContainerLowest = argbFromRgb(8, 10, 11);

  return Object.entries(scheme);
}

/**
 * @returns A string of CSS code with custom properties representing the color scheme values.
 * */
export const genCSS = (light: SerializedScheme, dark: SerializedScheme) => {
  const lightColors = Object.entries(light).map(([name, argb]) => genColorVariable(name, argb)).join("\n");
  const darkColors = Object.entries(dark).map(([name, argb]) => genColorVariable(name, argb)).join("\n");
  const oledDarkColors = getOledDarkColors(dark).map(([name, argb]) => genColorVariable(name, argb)).join("\n");

  const colors = `
:root {
  accent-color: rgb(var(--m3-scheme-primary));
}
@media (prefers-color-scheme: light) {
  [data-theme="Auto"] {
  ${lightColors}
  }
}
@media (prefers-color-scheme: dark) {
  [data-theme="Auto"] {
  ${darkColors}
  }
}
[data-theme="Light"] {
${lightColors}
}
[data-theme="Dark"] {
${darkColors}
}
[data-theme="oled-dark"] {
${oledDarkColors}
}`;
  return colors;
};

/**
 * Serializes a scheme's color values into argb.
 * @param scheme The scheme to use.
 */
export function serializeScheme(scheme: SchemeTonalSpot) {
  const out: Record<string, number> = {};

  for (const color of colors) {
    out[color] = MaterialDynamicColors[color].getArgb(scheme as DynamicScheme);
  }

  return out as SerializedScheme;
}