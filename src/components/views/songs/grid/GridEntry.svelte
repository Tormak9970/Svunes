<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Song } from "../../../../lib/models/Song";
  import { inSelectMode, selected } from "../../../../stores/Select";
  import { holdEvent } from "../../../../lib/directives/HoldEvent";
  import { PlaybackController } from "../../../../lib/controllers/PlaybackController";
  import SongOptions from "../SongOptions.svelte";
  import MenuButton from "../../../interactables/MenuButton.svelte";
  import { GRID_IMAGE_DIMENSIONS, IMAGE_FADE_OPTIONS } from "../../../../lib/utils/ImageConstants";
  import Lazy from "../../../layout/Lazy.svelte";
  import { songGridSize, songSortOrder } from "../../../../stores/State";
  import { GridSize } from "../../../../types/Settings";
  import MusicNotePlaceholder from "../../../layout/placeholders/MusicNotePlaceholder.svelte";
  import { fade } from "svelte/transition";
  import { renderDate } from "../../../../lib/utils/Utils";

  export let song: Song;

  $: convertedPath = song.albumPath ? tauri.convertFileSrc(song.albumPath) : "";
  $: highlighted = $selected.includes(song.title);

  function onClick(e: MouseEvent) {
    if ($inSelectMode) {
      const titleIndex = $selected.indexOf(song.title);
      if (titleIndex !== -1) {
        $selected.splice(titleIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, song.title ];
      }
    } else {
      PlaybackController.playSong(song);
    }
  }

  function select() {
    if (!$inSelectMode) {
      $selected = [ ...$selected, song.title ];
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="song" class:highlight={highlighted} on:click={onClick} use:holdEvent={{ onHold: select, duration: 300 }}>
  <div class="album" style="width: {GRID_IMAGE_DIMENSIONS[$songGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$songGridSize].height}px;">
    {#if convertedPath !== ""}
      <Lazy height={GRID_IMAGE_DIMENSIONS[$songGridSize].height - 5} fadeOption={IMAGE_FADE_OPTIONS}>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{convertedPath}" style="width: {GRID_IMAGE_DIMENSIONS[$songGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$songGridSize].height}px;" draggable="false" />
        <span slot="placeholder">
          <MusicNotePlaceholder />
        </span>
      </Lazy>
    {:else}
      <MusicNotePlaceholder />
    {/if}
  </div>
  <div class="bottom" class:expand={$songGridSize !== GridSize.LARGE}>
    <div class="info">
      <div class="name">
        {song.title}
      </div>
      <div class="secondary">
        {#if $songSortOrder === "Alphabetical"}
          <div in:fade={{ duration: 200 }}>{song.artist ?? "Unk"}</div>
        {:else if $songSortOrder === "Album"}
          <div in:fade={{ duration: 200 }}>{song.album ?? "Unk"}</div>
        {:else if $songSortOrder === "Artist"}
          <div in:fade={{ duration: 200 }}>{song.artist ?? "Unk"}</div>
        {:else if $songSortOrder === "Year"}
          <div in:fade={{ duration: 200 }}>{song.releaseYear ?? "Unk"}</div>
        {:else if $songSortOrder === "Last Played"}
          <div in:fade={{ duration: 200 }}>{song.lastPlayedOn === "Never" ? "Never" : renderDate(song.lastPlayedOn)}</div>
        {/if}
      </div>
    </div>
    {#if !highlighted && $songGridSize === GridSize.LARGE}
      <div class="options">
        <MenuButton>
          <span slot="icon">
            <!-- <MoreVert /> -->
          </span>
          <SongOptions song={song} />
        </MenuButton>
      </div>
    {/if}
  </div>
  <md-ripple></md-ripple>
</div>

<style>
  .song {
    width: calc(100% - 10px);

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;

    padding: 5px;

    transition: background-color 0.2s ease-in-out;

    border-radius: 10px;

    margin-top: 2px;
  }

  .highlight {
    background-color: var(--md-sys-color-surface-variant);
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
  }

  .highlight .info,
  .expand .info {
    width: 100%;
  }

  .name {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary {
    font-size: 14px;
    color: var(--md-sys-color-on-surface-variant);
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .album {
    border-radius: 10px;
    overflow: hidden;
  }
</style>