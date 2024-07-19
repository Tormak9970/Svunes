<script lang="ts">
  import CardClickable from "@layout/CardClickable.svelte";
  import type { Album } from "@lib/models/Album";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { renderDate, t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { albumGridSize, albumSortOrder } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import { GridSize } from "../../../types/Settings";
  import ViewImage from "../../utils/ViewImage.svelte";

  export let album: Album;

  $: convertedPath = album.artPath ? convertFileSrc(album.artPath) : "";
  $: highlighted = $selected.includes(album.name);
  $: size = $albumGridSize === GridSize.MEDIUM ? 40 : 60;

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
    if (!$inSelectMode) {
      $selected = [ ...$selected, album.name ];
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:highlight={highlighted}>
    <ViewImage src={convertedPath} width={GRID_IMAGE_DIMENSIONS[$albumGridSize].width} height={GRID_IMAGE_DIMENSIONS[$albumGridSize].height} iconSize={size} />
    <div class="bottom" style="height: {GRID_IMAGE_DIMENSIONS[$albumGridSize].infoHeight}px;">
      <div class="info">
        <div class="font-label name">
          {album.name}
        </div>
        <div class="font-body secondary">
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
        </div>
      </div>
    </div>
  </div>
</CardClickable>

<style>
  .content {
    width: calc(100% - 10px); 
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bottom {
    padding-top: 9px;
    padding-bottom: 4px;
    width: calc(100% - 20px);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    margin-right: 0px;
    width: 100%;
  }

  .name {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary > div {
    color: rgb(var(--m3-scheme-outline));
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>