<script lang="ts">
  import { getArtistMenuItems, getSelectContextMenuItems } from "@context-menus";
  import { ListEntry } from "@layout";
  import type { Artist } from "@models";
  import { t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { location, push } from "svelte-spa-router";

  export let artist: Artist;
  export let isSelectable = true;

  $: convertedPath = artist.imagePath ? convertFileSrc(artist.imagePath) : "";
  $: highlighted = $selected.includes(artist.name);
  
  $: selectCtxItems = getSelectContextMenuItems($selected, $t, $location);
  $: artistMenuItems = getArtistMenuItems(artist, $t);

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

<ListEntry
  label={artist.name}
  convertedPath={convertedPath}
  highlighted={highlighted}
  holdable={!$inSelectMode && isSelectable}
  ctxMenuId="artist-options"
  ctxMenuItems={highlighted ? selectCtxItems : artistMenuItems}
  on:click={onClick}
  on:hold={select}
/>