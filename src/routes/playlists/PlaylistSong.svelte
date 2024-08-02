<script lang="ts">
  import { PlaybackController } from "@controllers";
  import { holdEvent } from "@directives";
  import { MoreVert } from "@icons";
  import { MenuButton } from "@interactables";
  import { Lazy, MusicNotePlaceholder } from "@layout";
  import type { Song } from "@models";
  import { t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { IMAGE_FADE_OPTIONS, LIST_IMAGE_DIMENSIONS } from "@utils";
  import SongOptions from "@views/songs/SongOptions.svelte";

  export let song: Song;

  $: convertedPath = song.artPath ? convertFileSrc(song.artPath) : "";
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
    $selected = [ ...$selected, song.id ];
  }
  
  let menuIsOpen = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button class="m3-container playlist-song">
  <div class="layer" class:highlight />
  <div class="content-wrapper">
    <slot />
    <div
      class="content"
      use:holdEvent={{ onHold: select, holdable: !$inSelectMode, duration: 300 }}
      on:click|stopPropagation={onClick}
    >
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
          <div class="font-label name">
            {song.title ?? song.fileName}
          </div>
          <div class="font-body secondary">
            <div class="artist">
              {song.artist ?? $t("UNKOWN_VALUE")}
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
    border: none;
    border-radius: 10px;
    padding: 0px;
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
  }
  .layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transition: background-color 0.2s;
    pointer-events: none;

    z-index: 1;
  }

  button {
    text-align: inherit;
    font: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:hover {
    box-shadow: var(--m3-util-elevation-1);
  }
  button:hover > .layer {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.08);
  }
  
  button:is(:focus-visible, :active) > .layer,
  .highlight.layer,
  button:hover > .highlight.layer {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }

  :global(#dnd-action-dragged-el .playlist-song > .layer) {
    background-color: rgb(var(--m3-scheme-surface-container-highest));
	}

  .content-wrapper {
    width: 100%; 
    display: flex;
    align-items: center;

    position: relative;
    z-index: 2;
  }

  .content {
    margin-left: 40px;
    padding: 10px 0px;
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