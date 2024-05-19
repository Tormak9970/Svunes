<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Song } from "../../../lib/models/Song";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { IMAGE_FADE_OPTIONS, LIST_IMAGE_DIMENSIONS } from "../../../lib/utils/ImageConstants";
  import Lazy from "../../layout/Lazy.svelte";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import { songSortOrder } from "../../../stores/State";
  import { fade } from "svelte/transition";
  import { renderDate } from "../../../lib/utils/Utils";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import CardClickable from "../../layout/CardClickable.svelte";
  import { Button, Icon } from "m3-svelte";
  import { showSongOptions, songToShowOptions } from "../../../stores/Overlays";

  export let song: Song;

  $: convertedPath = song.artPath ? tauri.convertFileSrc(song.artPath) : "";
  $: highlighted = $selected.includes(song.key);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick(e: MouseEvent) {
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
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:highlight={highlighted}>
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
    </div>
    {#if !highlighted}
      <div class="options">
        <Button type="text" iconType="full" on:click={openSongOptions}>
          <Icon icon={MoreVert} />
        </Button>
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