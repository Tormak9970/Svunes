<script lang="ts">
  import { GridEntry } from "@layout";
  import type { Artist } from "@models";
  import { t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { artistGridSize } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { getSelectContextMenuItems } from "@views/SelectHeader.svelte";
  import { push } from "svelte-spa-router";
  import { getContextMenuItems } from "./ArtistOptions.svelte";

  export let artist: Artist;

  $: convertedPath = artist.imagePath ? convertFileSrc(artist.imagePath) : "";
  $: highlighted = $selected.includes(artist.name);
  
  $: selectCtxItems = getSelectContextMenuItems($t);
  $: ctxMenuItems = getContextMenuItems(artist, $t);

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
    $selected = [ ...$selected, artist.name ];
  }
</script>

<GridEntry
  label={artist.name}
  {highlighted}
  gridSize={$artistGridSize}
  convertedPath={convertedPath}
  centerLabel
  borderRadius="50%"
  holdable={!$inSelectMode}
  ctxMenuId="artist-options"
  ctxMenuItems={highlighted ? selectCtxItems : ctxMenuItems}
  on:click={onClick}
  on:hold={select}
/>