<script lang="ts">
  import { argbFromHex, Hct, SchemeTonalSpot } from "@material/material-color-utilities";
  import { palette, themePrimaryColor, useOledPalette } from "@stores/State";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import { isLandscape } from "../../stores/Layout";
  import { genCSS, serializeScheme, type SerializedScheme } from "./themeUtils";

  let primaryColorUnsub: Unsubscriber;
  let paletteUnsub: Unsubscriber;
  let oledPaletteUnsub: Unsubscriber
  
  let contrast = 0.0;

  let lightScheme: SerializedScheme;
  let darkScheme: SerializedScheme;

  let styling = "";
  $: if (lightScheme && darkScheme) styling = genCSS(lightScheme, darkScheme);

  onMount(() => {
    primaryColorUnsub = themePrimaryColor.subscribe((color) => {
      if (color !== "") {
        darkScheme = serializeScheme(new SchemeTonalSpot(Hct.fromInt(argbFromHex(color)), true, contrast));
        lightScheme = serializeScheme(new SchemeTonalSpot(Hct.fromInt(argbFromHex(color)), false, contrast));
      }
    });

    paletteUnsub = palette.subscribe((newPalette) => {
      document.body.setAttribute("data-theme", $useOledPalette ? "oled-dark" : newPalette);
    });

    oledPaletteUnsub = useOledPalette.subscribe((shouldUse) => {
      document.body.setAttribute("data-theme", shouldUse ? "oled-dark" : $palette);
    });
  });

  onDestroy(() => {
    if (primaryColorUnsub) primaryColorUnsub();
    if (paletteUnsub) paletteUnsub();
    if (oledPaletteUnsub) oledPaletteUnsub();
  })
</script>

<main class:mobile={!$isLandscape}>
  {@html `<${""}style>${styling}</${""}style>`}
  <slot />
</main>

<style>
  main {
    height: 100%;
    width: 100%;

    background-color: rgb(var(--m3-scheme-background));
    color: rgb(var(--m3-scheme-on-background));

    display: flex;
    align-items: center;
    flex-direction: column-reverse;

    position: relative;
  }
</style>