<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Song } from "../../../lib/models/Song";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { GRID_IMAGE_DIMENSIONS, IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import Lazy from "../../layout/Lazy.svelte";
  import { songGridSize, songSortOrder } from "../../../stores/State";
  import { GridSize } from "../../../types/Settings";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import { fade } from "svelte/transition";
  import { renderDate } from "../../../lib/utils/Utils";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import CardClickable from "../../layout/CardClickable.svelte";
  import { showSongOptions, songToShowOptions } from "../../../stores/Overlays";
  import { Button, Icon } from "m3-svelte";

  export let song: Song;

  $: convertedPath = song.artPath ? tauri.convertFileSrc(song.artPath) : "";
  $: highlighted = $selected.includes(song.key);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    if ($inSelectMode) {
      const titleIndex = $selected.indexOf(song.key);
      if (titleIndex !== -1) {
        $selected.splice(titleIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, song.key ];
      }
    } else {
      PlaybackController.playSong(song);
    }
  }

  /**
   * Shows the entry's options.
   */
  function openSongOptions() {
    $songToShowOptions = song.key;
    $showSongOptions = true;
  }

  /**
   * Handles when the user selects the entry.
   */
  function select() {
    if (!$inSelectMode) {
      $selected = [ ...$selected, song.key ];
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:highlight={highlighted}>
    <div class="album" style="width: {GRID_IMAGE_DIMENSIONS[$songGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$songGridSize].height}px;">
      {#if convertedPath !== ""}
        <Lazy height={GRID_IMAGE_DIMENSIONS[$songGridSize].height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="{convertedPath}" style="width: {GRID_IMAGE_DIMENSIONS[$songGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$songGridSize].height}px;" draggable="false" on:error={onError} />
          <span slot="placeholder">
            <MusicNotePlaceholder />
          </span>
        </Lazy>
      {:else}
        <MusicNotePlaceholder />
      {/if}
    </div>
    <div class="bottom" style="height: {GRID_IMAGE_DIMENSIONS[$songGridSize].infoHeight}px;" class:expand={$songGridSize !== GridSize.LARGE}>
      <div class="info">
        <div class="name">
          {song.title}
        </div>
        <div class="secondary">
          {#if $songSortOrder === "Alphabetical"}
            <div in:fade={{ duration: 200 }}>{song.artist ?? "Unkown"}</div>
          {:else if $songSortOrder === "Album"}
            <div in:fade={{ duration: 200 }}>{song.album ?? "Unkown"}</div>
          {:else if $songSortOrder === "Artist"}
            <div in:fade={{ duration: 200 }}>{song.artist ?? "Unkown"}</div>
          {:else if $songSortOrder === "Year"}
            <div in:fade={{ duration: 200 }}>{song.releaseYear === -1 ? "Unkown" : song.releaseYear}</div>
          {:else if $songSortOrder === "Most Played"}
            <div in:fade={{ duration: 200 }}>{song.numTimesPlayed}</div>
          {:else if $songSortOrder === "Last Played"}
            <div in:fade={{ duration: 200 }}>{song.lastPlayedOn === "Never" ? "Never" : renderDate(song.lastPlayedOn)}</div>
          {/if}
        </div>
      </div>
      {#if !highlighted && $songGridSize === GridSize.LARGE}
        <div class="options">
          <Button type="text" iconType="full" on:click={openSongOptions}>
            <Icon icon={MoreVert} />
          </Button>
        </div>
      {/if}
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
    width: calc(100% - 40px);
    margin-right: 5px;
  }

  .highlight .info,
  .expand .info {
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