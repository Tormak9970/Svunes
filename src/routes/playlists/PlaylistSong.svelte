<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import Lazy from "../../components/layout/Lazy.svelte";
  import MusicNotePlaceholder from "../../components/layout/placeholders/MusicNotePlaceholder.svelte";
  import { IMAGE_FADE_OPTIONS, LIST_IMAGE_DIMENSIONS } from "../../lib/utils/ImageConstants";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import type { Song } from "../../lib/models/Song";
  import { inSelectMode, selected } from "../../stores/Select";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import MenuButton from "../../components/interactables/MenuButton.svelte";
  import SongOptions from "../../components/views/songs/SongOptions.svelte";
  import { holdEvent } from "../../lib/directives/HoldEvent";

  export let song: Song;

  $: convertedPath = song.artPath ? tauri.convertFileSrc(song.artPath) : "";
  $: highlight = $selected.includes(song.id);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick(e: MouseEvent) {
    if ($inSelectMode) {
      const titleIndex = $selected.indexOf(song.id);
      if (titleIndex !== -1) {
        $selected.splice(titleIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, song.id ];
      }
    } else {
      PlaybackController.playSong(song);
    }
  }

  /**
   * Handles when the user selects the entry.
   */
  function select() {
    if (!$inSelectMode) {
      $selected = [ ...$selected, song.id ];
    }
  }
  
  let menuIsOpen = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
  class="m3-container"
>
  <div class="layer" class:highlight />
  <div class="content-wrapper">
    <slot />
    <div class="content" use:holdEvent={{ onHold: select, duration: 300 }} on:click|stopPropagation={onClick}>
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
            {song.title}
          </div>
          <div class="secondary">
            <div class="artist">
              {song.artist ?? "Unkown"}
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <MenuButton icon={MoreVert} bind:open={menuIsOpen} extraOptions={{ style: "display: flex;" }}>
          <SongOptions bind:menuIsOpen={menuIsOpen} song={song} />
        </MenuButton>
      </div>
    </div>
  </div>
</button>

<style>
  :root {
    --m3-card-shape: var(--m3-util-rounding-medium);
  }
  .m3-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 10px 0px;
    border: none;
    border-radius: 10px;
    margin: 2px 0px;
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
  }
  .layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transition: background-color 0.2s;
    pointer-events: none;
  }

  button {
    text-align: inherit;
    font: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  @media (hover: hover) {
    button:hover {
      box-shadow: var(--m3-util-elevation-1);
    }
    button:hover > .layer {
      background-color: rgb(var(--m3-scheme-on-surface) / 0.08);
    }
  }
  button:is(:focus-visible, :active) > .layer {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }
  
  .highlight.layer,
  button:hover > .highlight.layer {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }

  .content-wrapper {
    width: 100%; 
    display: flex;
    align-items: center;
  }

  .content {
    width: calc(100% - 40px); 
    display: flex;
    align-items: center;
  }

  .left {
    display: flex;
    align-items: center;
    width: calc(100% - 50px);
    margin-right: 10px;
  }

  .info {
    width: calc(100% - 60px);
  }

  .name {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary {
    color: rgb(var(--m3-scheme-outline));
    font-size: 14px;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .album {
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    width: 40px;

    margin-left: 5px;
    margin-right: 15px;
  }
</style>