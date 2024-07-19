<script lang="ts">
  import MenuButton from "@interactables/MenuButton.svelte";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import CardClickable from "@layout/CardClickable.svelte";
  import Lazy from "@layout/Lazy.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import type { Song } from "@lib/models/Song";
  import { IMAGE_FADE_OPTIONS, LIST_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import SongOptions from "@views/songs/SongOptions.svelte";

  export let song: Song;

  $: convertedPath = song.artPath ? convertFileSrc(song.artPath) : "";
  $: highlighted = $selected.includes(song.id);

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
        <div class="font-label name">
          {song.title ?? song.fileName}
        </div>
        <div class="font-body secondary">
          <div class="artist">
            {song.artist ?? $t("UNKOWN_VALUE")}
          </div>
          <div class="other">
            {song.trackNumber ? song.trackNumber + " | " : ""}{song.displayLength()}
          </div>
        </div>
      </div>
    </div>
    {#if !$inSelectMode}
      <div class="options">
        <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
          <SongOptions bind:menuIsOpen={menuIsOpen} song={song} />
        </MenuButton>
      </div>
    {/if}
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
    width: calc(100% - 40px);
  }

  .info {
    width: calc(100% - 75px);
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

    margin-left: 10px;
    margin-right: 15px;
  }
</style>