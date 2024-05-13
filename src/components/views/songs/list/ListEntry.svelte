<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Song } from "../../../../lib/models/Song";
  import MoreVert from "svelte-icons/md/MdMoreVert.svelte";
  import { inSelectMode, selected } from "../../../../stores/Select";
  import { holdEvent } from "../../../../lib/directives/HoldEvent";
  import { PlaybackController } from "../../../../lib/controllers/PlaybackController";
  import SongOptions from "../SongOptions.svelte";
  import MenuButton from "../../../interactables/MenuButton.svelte";
  import { IMAGE_FADE_OPTIONS, LIST_IMAGE_DIMENSIONS } from "../../../../lib/utils/ImageConstants";
  import Lazy from "svelte-lazy";
  import MusicNote from "svelte-icons/md/MdMusicNote.svelte";

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
  <div class="left">
    <div class="album">
      {#if convertedPath !== ""}
        <Lazy height="{LIST_IMAGE_DIMENSIONS.height}px" fadeOption={IMAGE_FADE_OPTIONS}>
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="{convertedPath}" style="width: {LIST_IMAGE_DIMENSIONS.width}px; height: {LIST_IMAGE_DIMENSIONS.height}px;" draggable="false" />
        </Lazy>
      {:else}
        <div class="placeholder-background">
          <div class="icon-container">
            <MusicNote />
          </div>
        </div>
      {/if}
    </div>
    <div class="info">
      <div class="name">
        {song.title}
      </div>
      <div class="artist">
        {song.artist}
      </div>
    </div>
  </div>
  {#if !highlighted}
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

<style>
  .song {
    width: 100%;

    display: flex;
    align-items: center;

    padding: 10px 0px;

    transition: background-color 0.2s ease-in-out;

    border-radius: 10px;
    margin: 3px 0px;
  }

  .highlight {
    background-color: var(--md-sys-color-surface-container-highest);
  }

  .left {
    display: flex;
    align-items: center;
    width: calc(100% - 36px);
  }

  .info {
    max-width: calc(100% - 75px - 30px);
  }

  .highlight .left {
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
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    width: 40px;

    margin-left: 20px;
    margin-right: 15px;
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
    width: 30px;
    height: 30px;
  }
</style>