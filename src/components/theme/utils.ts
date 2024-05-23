import { DynamicScheme, MaterialDynamicColors, SchemeTonalSpot } from "@material/material-color-utilities";

export type Color =
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

export const pairs = [
  ["primary", "onPrimary"],
  ["primaryContainer", "onPrimaryContainer"],
  ["secondary", "onSecondary"],
  ["secondaryContainer", "onSecondaryContainer"],
  ["tertiary", "onTertiary"],
  ["tertiaryContainer", "onTertiaryContainer"],
  ["background", "onBackground"],
  ["surface", "onSurface"],
  ["inverseSurface", "inverseOnSurface"],
  ["surfaceVariant", "onSurfaceVariant"],
  ["error", "onError"],
  ["errorContainer", "onErrorContainer"],
];

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
 * @returns A string of CSS code with custom properties representing the color scheme values.
 * */
export const genCSS = (light: SerializedScheme, dark: SerializedScheme) => {
  const genColorVariable = (name: string, argb: number) => {
    const kebabCase = name.replace(/[A-Z]/g, (letter: string) => `-${letter.toLowerCase()}`);
    const red = (argb >> 16) & 255;
    const green = (argb >> 8) & 255;
    const blue = argb & 255;
    return `--m3-scheme-${kebabCase}: ${red} ${green} ${blue};`;
  };
  const lightColors = Object.entries(light).map(([name, argb]) => genColorVariable(name, argb)).join("\n");
  const darkColors = Object.entries(dark).map(([name, argb]) => genColorVariable(name, argb)).join("\n");

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
}`;
  return colors;
};

export const serializeScheme = (scheme: SchemeTonalSpot) => {
  const out: Record<string, number> = {};

  for (const color of colors) {
    out[color] = MaterialDynamicColors[color].getArgb(scheme as DynamicScheme);
  }

  return out as SerializedScheme;
};