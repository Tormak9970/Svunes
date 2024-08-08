<script lang="ts">
  import { ListEntry } from "@layout";
  import type { Album } from "@models";
  import { renderDate, t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import type { AlbumSortOrder } from "@types";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { getContextMenuItems } from "./AlbumOptions.svelte";

  export let album: Album;
  export let detailType: AlbumSortOrder;
  export let isSelectable = true;

  $: convertedPath = album.artPath ? convertFileSrc(album.artPath) : "";
  $: highlighted = $selected.includes(album.name);
  
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

<ListEntry
  label={album.name}
  convertedPath={convertedPath}
  highlighted={highlighted}
  holdable={!$inSelectMode && isSelectable}
  ctxMenuId="album-options"
  ctxMenuItems={ctxMenuItems}
  on:click={onClick}
  on:hold={select}
>
  <span slot="details">
    {#if detailType === "Alphabetical"}
      <div in:fade={{ duration: 200 }}>{album.albumArtist ?? $t("UNKOWN_VALUE")}</div>
    {:else if detailType === "Artist"}
      <div in:fade={{ duration: 200 }}>{album.albumArtist ?? $t("UNKOWN_VALUE")}</div>
    {:else if detailType === "Year"}
      <div in:fade={{ duration: 200 }}>{album.releaseYear === -1 ? $t("UNKOWN_VALUE") : album.releaseYear}</div>
    {:else if detailType === "Length"}
      <div in:fade={{ duration: 200 }}>{album.displayAlbumLength()}</div>
    {:else if detailType === "Track Count"}
      <div in:fade={{ duration: 200 }}>{album.songIds.length} {album.songIds.length === 1 ? $t("TRACKS_SINGULAR_VALUE") : $t("TRACKS_PLURAL_VALUE")}</div>
    {:else if detailType === "Most Played"}
      <div in:fade={{ duration: 200 }}>{album.numTimesPlayed}</div>
    {:else if detailType === "Last Played"}
      <div in:fade={{ duration: 200 }}>{album.lastPlayedOn === "Never" ? $t("NEVER_VALUE") : $renderDate(album.lastPlayedOn)}</div>
    {/if}
  </span>
</ListEntry>