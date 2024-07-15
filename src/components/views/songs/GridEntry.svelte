<script lang="ts">
  import MenuButton from "@interactables/MenuButton.svelte";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import CardClickable from "@layout/CardClickable.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import type { Song } from "@lib/models/Song";
  import t from "@lib/utils/i18n";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { renderDate } from "@lib/utils/Utils";
  import { inSelectMode, selected } from "@stores/Select";
  import { songGridSize, songSortOrder } from "@stores/State";
  import { tauri } from "@tauri-apps/api";
  import { fade } from "svelte/transition";
  import { GridSize } from "../../../types/Settings";
  import ViewImage from "../../utils/ViewImage.svelte";
  import SongOptions from "./SongOptions.svelte";

  export let song: Song;

  $: convertedPath = song.artPath ? tauri.convertFileSrc(song.artPath) : "";
  $: highlighted = $selected.includes(song.id);
  $: size = $songGridSize === GridSize.MEDIUM ? 40 : 60;

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
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
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:in-select-mode={$inSelectMode}>
    <ViewImage src={convertedPath} width={GRID_IMAGE_DIMENSIONS[$songGridSize].width} height={GRID_IMAGE_DIMENSIONS[$songGridSize].height} iconSize={size} />
    <div class="bottom" style="height: {GRID_IMAGE_DIMENSIONS[$songGridSize].infoHeight}px;" class:expand={$songGridSize !== GridSize.LARGE}>
      <div class="info">
        <div class="name">
          {song.title ?? song.fileName}
        </div>
        <div class="secondary">
          {#if $songSortOrder === "Alphabetical"}
            <div in:fade={{ duration: 200 }}>{song.artist ?? t("UNKOWN_VALUE")}</div>
          {:else if $songSortOrder === "Album"}
            <div in:fade={{ duration: 200 }}>{song.album ?? t("UNKOWN_VALUE")}</div>
          {:else if $songSortOrder === "Artist"}
            <div in:fade={{ duration: 200 }}>{song.artist ?? t("UNKOWN_VALUE")}</div>
          {:else if $songSortOrder === "Year"}
            <div in:fade={{ duration: 200 }}>{song.releaseYear === -1 ? t("UNKOWN_VALUE") : song.releaseYear}</div>
          {:else if $songSortOrder === "Most Played"}
            <div in:fade={{ duration: 200 }}>{song.numTimesPlayed}</div>
          {:else if $songSortOrder === "Last Played"}
            <div in:fade={{ duration: 200 }}>{song.lastPlayedOn === "Never" ? t("NEVER_VALUE") : renderDate(song.lastPlayedOn)}</div>
          {/if}
        </div>
      </div>
      {#if !$inSelectMode && $songGridSize === GridSize.LARGE}
        <div class="options">
          <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
            <SongOptions bind:menuIsOpen={menuIsOpen} song={song} />
          </MenuButton>
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

  .in-select-mode .info,
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
</style>