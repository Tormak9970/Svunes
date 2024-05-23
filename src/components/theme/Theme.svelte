<script lang="ts">
  import { argbFromHex, themeFromSourceColor, applyTheme, SchemeTonalSpot } from "@material/material-color-utilities";
  import StyleFromScheme from "./styles/StyleFromScheme.svelte";
  import type { Unsubscriber } from "svelte/store";
  import { onMount } from "svelte";

  let primaryColorUnsub: Unsubscriber;
  let paletteUnsub: Unsubscriber;
  let oledPaletteUnsub: Unsubscriber

  // Get the theme from a hex color
  // const theme = themeFromSourceColor(argbFromHex('#3B872E'), [
  //   // {
  //   //   name: "custom-1",
  //   //   value: argbFromHex("#ff0000"),
  //   //   blend: true,
  //   // },
  // ]);

  // // Print out the theme as JSON
  // console.log(JSON.stringify(theme, null, 2));

  // // Check if the user has dark mode turned on
  // const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // // Apply the theme to the body by updating custom properties for material tokens
  // applyTheme(theme, {target: document.body, dark: systemDark});

  onMount(() => {

  })
</script>

<main>
  <StyleFromScheme
    lightScheme={{"primary":4285551241,"onPrimary":4294967295,"primaryContainer":4294040319,"onPrimaryContainer":4280880193,"inversePrimary":4292655608,"secondary":4284897903,"onSecondary":4294967295,"secondaryContainer":4293778934,"onSecondaryContainer":4280358953,"tertiary":4286599510,"onTertiary":4294967295,"tertiaryContainer":4294957532,"onTertiaryContainer":4281470998,"error":4290386458,"onError":4294967295,"errorContainer":4294957782,"onErrorContainer":4282449922,"background":4294965246,"onBackground":4280162848,"surface":4294965246,"onSurface":4280162848,"surfaceVariant":4293517290,"onSurfaceVariant":4283123021,"inverseSurface":4281544501,"inverseOnSurface":4294438646,"outline":4286346622,"outlineVariant":4291675342,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4292925663,"surfaceBright":4294965246,"surfaceContainerLowest":4294967295,"surfaceContainerLow":4294636025,"surfaceContainer":4294241267,"surfaceContainerHigh":4293846765,"surfaceContainerHighest":4293452008,"surfaceTint":4285551241}}
    darkScheme={{"primary":4292655608,"onPrimary":4282327896,"primaryContainer":4283906672,"onPrimaryContainer":4294040319,"inversePrimary":4285551241,"secondary":4291936729,"onSecondary":4281805887,"secondaryContainer":4283318870,"onSecondaryContainer":4293778934,"tertiary":4294162364,"onTertiary":4283180330,"tertiaryContainer":4284889663,"onTertiaryContainer":4294957532,"error":4294948011,"onError":4285071365,"errorContainer":4287823882,"onErrorContainer":4294957782,"background":4279570967,"onBackground":4293452008,"surface":4279570967,"onSurface":4293452008,"surfaceVariant":4283123021,"onSurfaceVariant":4291675342,"inverseSurface":4293452008,"inverseOnSurface":4281544501,"outline":4288056984,"outlineVariant":4283123021,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4279570967,"surfaceBright":4282136638,"surfaceContainerLowest":4279242002,"surfaceContainerLow":4280162848,"surfaceContainer":4280426020,"surfaceContainerHigh":4281084206,"surfaceContainerHighest":4281807673,"surfaceTint":4292655608}}
  />
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