<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Album } from "../../../lib/models/Album";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { IMAGE_FADE_OPTIONS, LIST_IMAGE_DIMENSIONS } from "../../../lib/utils/ImageConstants";
  import Lazy from "../../layout/Lazy.svelte";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import { albumSortOrder } from "../../../stores/State";
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
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="left">
      <div class="album">
        {#if convertedPath !== ""}
          <Lazy height={LIST_IMAGE_DIMENSIONS.height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="{convertedPath}" style="width: {LIST_IMAGE_DIMENSIONS.width}px; height: {LIST_IMAGE_DIMENSIONS.height}px;" draggable="false" on:error={onError} />
            <span slot="placeholder">
              <MusicNotePlaceholder />
            </span>
          </Lazy>
        {:else}
          <MusicNotePlaceholder />
        {/if}
      </div>
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
            <div in:fade={{ duration: 200 }}>{album.songIds.length + " tracks"}</div>
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
    width: 100%; 
    display: flex;
    align-items: center;
  }

  .left {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .info {
    max-width: calc(100% - 75px - 30px);
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
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    width: 40px;

    margin-left: 10px;
    margin-right: 15px;
  }
</style>