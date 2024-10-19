<script lang="ts">
  import { GridEntry } from "@layout";
  import type { Album } from "@models";
  import { renderDate, t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { albumGridSize, albumSortOrder } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { GridSize } from "@types";
  import { getSelectContextMenuItems } from "@views/SelectHeader.svelte";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { getContextMenuItems } from "./AlbumOptions.svelte";

  export let album: Album;

  $: convertedPath = album.artPath ? convertFileSrc(album.artPath) : "";
  $: highlighted = $selected.includes(album.name);
  $: size = $albumGridSize === GridSize.MEDIUM ? 40 : 60;
  
  $: selectCtxItems = getSelectContextMenuItems($t);
  $: ctxMenuItems = getContextMenuItems(album, $t);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    if ($inSelectMode) {
      const nameIndex = $selected.indexOf(album.name);
      if (nameIndex !== -1) {
        $selected.splice(nameIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, album.name ];
      }
    } else {
      push(`/albums/${album.name}`);
    }
  }

  /**
   * Handles when the user selects the entry.
   */
  function select() {
    $selected = [ ...$selected, album.name ];
  }
</script>

<GridEntry
  label={album.name}
  {highlighted}
  gridSize={$albumGridSize}
  convertedPath={convertedPath}
  holdable={!$inSelectMode}
  ctxMenuId="album-options"
  ctxMenuItems={highlighted ? selectCtxItems : ctxMenuItems}
  on:click={onClick}
  on:hold={select}
>
  <span slot="details">
    {#if $albumSortOrder === "Alphabetical"}
      <div in:fade={{ duration: 200 }}>{album.albumArtist ?? $t("UNKOWN_VALUE")}</div>
    {:else if $albumSortOrder === "Artist"}
      <div in:fade={{ duration: 200 }}>{album.albumArtist ?? $t("UNKOWN_VALUE")}</div>
    {:else if $albumSortOrder === "Year"}
      <div in:fade={{ duration: 200 }}>{album.releaseYear === -1 ? $t("UNKOWN_VALUE") : album.releaseYear}</div>
    {:else if $albumSortOrder === "Length"}
      <div in:fade={{ duration: 200 }}>{album.displayAlbumLength()}</div>
    {:else if $albumSortOrder === "Track Count"}
      <div in:fade={{ duration: 200 }}>{album.songIds.length} {album.songIds.length === 1 ? $t("TRACKS_SINGULAR_VALUE") : $t("TRACKS_PLURAL_VALUE")}</div>
    {:else if $albumSortOrder === "Most Played"}
      <div in:fade={{ duration: 200 }}>{album.numTimesPlayed}</div>
    {:else if $albumSortOrder === "Last Played"}
      <div in:fade={{ duration: 200 }}>{album.lastPlayedOn === "Never" ? $t("NEVER_VALUE") : $renderDate(album.lastPlayedOn)}</div>
    {/if}
  </span>
</GridEntry>