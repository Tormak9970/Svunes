<script lang="ts">
  import GridEntry from "@layout/entries/GridEntry.svelte";
  import type { Artist } from "@lib/models/Artist";
  import { inSelectMode, selected } from "@stores/Select";
  import { artistGridSize } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { push } from "svelte-spa-router";

  export let artist: Artist;

  $: convertedPath = artist.imagePath ? convertFileSrc(artist.imagePath) : "";
  $: highlighted = $selected.includes(artist.name);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    if ($inSelectMode) {
      const nameIndex = $selected.indexOf(artist.name);
      if (nameIndex !== -1) {
        $selected.splice(nameIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, artist.name ];
      }
    } else {
      push(`/artists/${artist.name}`);
    }
  }

  /**
   * Handles when the user selects the entry.
   */
  function select() {
    if (!$inSelectMode) {
      $selected = [ ...$selected, artist.name ];
    }
  }
</script>

<GridEntry label={artist.name} {highlighted} gridSize={$artistGridSize} convertedPath={convertedPath} centerLabel borderRadius="50%" on:click={onClick} on:hold={select} />