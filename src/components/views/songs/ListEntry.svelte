<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Song } from "../../../lib/models/Song";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { LIST_IMAGE_DIMENSIONS } from "../../../lib/utils/ImageConstants";
  import { songSortOrder } from "../../../stores/State";
  import { fade } from "svelte/transition";
  import { renderDate } from "../../../lib/utils/Utils";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import CardClickable from "../../layout/CardClickable.svelte";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import SongOptions from "./SongOptions.svelte";
  import ViewImage from "../../utils/ViewImage.svelte";

  export let song: Song;

  $: convertedPath = song.artPath ? tauri.convertFileSrc(song.artPath) : "";
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
  <div class="content" class:highlight={highlighted}>
    <div class="left">
      <ViewImage src={convertedPath} width={LIST_IMAGE_DIMENSIONS.width} height={LIST_IMAGE_DIMENSIONS.height} borderRadius="4px" marginLeft="10px" />
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
    max-width: calc(100% - 75px - 30px);
    margin-left: 15px;
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
</style>