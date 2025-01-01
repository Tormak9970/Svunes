<script lang="ts">
  import { getGenreMenuItems } from "@context-menus";
  import { ListEntry } from "@layout";
  import type { Genre } from "@models";
  import { t } from "@stores/Locale";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";

  export let genre: Genre;

  $: convertedPath = genre.imagePreviewPath ? convertFileSrc(genre.imagePreviewPath) : "";
  
  $: genreMenuItems = getGenreMenuItems(genre, $t);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    push(`/genres/${genre.name}`);
  }
</script>

<ListEntry
  label={genre.name}
  convertedPath={convertedPath}
  highlighted={false}
  ctxMenuId="genre-options"
  ctxMenuItems={genreMenuItems}
  on:click={onClick}
>
  <span slot="details">
    <div in:fade={{ duration: 200 }}>{genre.songIds.length} {genre.songIds.length === 1 ? $t("TRACKS_SINGULAR_VALUE") : $t("TRACKS_PLURAL_VALUE")}</div>
  </span>
</ListEntry>