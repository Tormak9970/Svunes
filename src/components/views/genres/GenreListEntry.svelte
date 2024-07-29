<script lang="ts">
  import ListEntry from "@layout/entries/ListEntry.svelte";
  import type { Genre } from "@models";
  import { t } from "@stores/Locale";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";

  export let genre: Genre;

  $: convertedPath = genre.imagePreviewPath ? convertFileSrc(genre.imagePreviewPath) : "";

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    push(`/genres/${genre.name}`);
  }
</script>

<ListEntry label={genre.name} convertedPath={convertedPath} highlighted={false} on:click={onClick}>
  <span slot="details">
    <div in:fade={{ duration: 200 }}>{genre.songIds.length} {genre.songIds.length === 1 ? $t("TRACKS_SINGULAR_VALUE") : $t("TRACKS_PLURAL_VALUE")}</div>
  </span>
</ListEntry>