<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Song } from "../../../../lib/models/Song";
  import MoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import { inSelectMode, selected } from "../../../../stores/Select";
  import { holdEvent } from "../../../../lib/directives/HoldEvent";
  import { PlaybackController } from "../../../../lib/controllers/PlaybackController";
  import SongOptions from "../SongOptions.svelte";
  import MenuButton from "../../../interactables/MenuButton.svelte";
  import { GRID_IMAGE_DIMENSIONS, IMAGE_FADE_OPTIONS } from "../../../../lib/utils/ImageConstants";
  import Lazy from "../../../layout/Lazy.svelte";
  import MusicNote from "svelte-icons/md/MdMusicNote.svelte";
  import { songGridSize } from "../../../../stores/State";
  import { GridSize } from "../../../../types/Settings";
  import MusicNotePlaceholder from "../../../layout/placeholders/MusicNotePlaceholder.svelte";

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
      PlaybackController.playSong(song.title);
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
      <div class="placeholder-background">
        <div class="icon-container">
          <MusicNote />
        </div>
      </div>
    {/if}
  </div>
  <div class="bottom" class:expand={$songGridSize !== GridSize.LARGE}>
    <div class="info">
      <div class="name">
        {song.title}
      </div>
      <div class="artist">
        {song.artist ?? "Unk"}{song.releaseYear ? ` - ${song.releaseYear === -1 ? "Unk" : song.releaseYear}` : ""}
      </div>
    </div>
    {#if !highlighted && $songGridSize === GridSize.LARGE}
      <div class="options">
        <MenuButton>
          <span slot="icon">
            <MoreVert />
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

  .artist {
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

  .placeholder-background {
    width: 100%;
    height: 100%;
    background-color: var(--md-sys-color-surface-container-low);
    color: var(--md-sys-color-on-secondary-container);

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon-container {
    width: 100%;
    height: 100%;
  }
</style>