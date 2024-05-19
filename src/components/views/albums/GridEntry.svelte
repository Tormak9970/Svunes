<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Album } from "../../../lib/models/Album";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { GRID_IMAGE_DIMENSIONS, IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import Lazy from "../../layout/Lazy.svelte";
  import { albumGridSize, albumSortOrder } from "../../../stores/State";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import { fade } from "svelte/transition";
  import { renderDate } from "../../../lib/utils/Utils";
  import CardClickable from "../../layout/CardClickable.svelte";
  import { push } from "svelte-spa-router";

  export let album: Album;

  $: convertedPath = album.artPath ? tauri.convertFileSrc(album.artPath) : "";
  $: highlighted = $selected.includes(album.name);

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
    <div class="album" style="width: {GRID_IMAGE_DIMENSIONS[$albumGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$albumGridSize].height}px;">
      {#if convertedPath !== ""}
        <Lazy height={GRID_IMAGE_DIMENSIONS[$albumGridSize].height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="{convertedPath}" style="width: {GRID_IMAGE_DIMENSIONS[$albumGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$albumGridSize].height}px;" draggable="false" on:error={onError} />
          <span slot="placeholder">
            <MusicNotePlaceholder />
          </span>
        </Lazy>
      {:else}
        <MusicNotePlaceholder />
      {/if}
    </div>
    <div class="bottom" style="height: {GRID_IMAGE_DIMENSIONS[$albumGridSize].infoHeight}px;">
      <div class="info">
        <div class="name">
          {album.name}
        </div>
        <div class="secondary">
          {#if $albumSortOrder === "Alphabetical"}
            <div in:fade={{ duration: 200 }}>{album.albumArtist ?? "Unkown"}</div>
          {:else if $albumSortOrder === "Artist"}
            <div in:fade={{ duration: 200 }}>{album.albumArtist ?? "Unkown"}</div>
          {:else if $albumSortOrder === "Year"}
            <div in:fade={{ duration: 200 }}>{album.releaseYear === -1 ? "Unkown" : album.releaseYear}</div>
          {:else if $albumSortOrder === "Length"}
            <div in:fade={{ duration: 200 }}>{album.displayAlbumLength()}</div>
          {:else if $albumSortOrder === "Track Count"}
            <div in:fade={{ duration: 200 }}>{album.songKeys.length + " tracks"}</div>
          {:else if $albumSortOrder === "Most Played"}
            <div in:fade={{ duration: 200 }}>{album.numTimesPlayed}</div>
          {:else if $albumSortOrder === "Last Played"}
            <div in:fade={{ duration: 200 }}>{album.lastPlayedOn === "Never" ? "Never" : renderDate(album.lastPlayedOn)}</div>
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

  .secondary {
    font-size: 14px;
    color: rgb(var(--m3-scheme-outline));
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .album {
    border-radius: 10px;
    overflow: hidden;
  }
</style>