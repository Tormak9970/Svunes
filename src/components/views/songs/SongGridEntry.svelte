<script lang="ts">
  import { PlaybackController } from "@controllers";
  import { MenuButton } from "@interactables";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { GridEntry } from "@layout";
  import type { Song } from "@models";
  import { renderDate, t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { songGridSize, songSortOrder } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { fade } from "svelte/transition";
  import SongOptions from "./SongOptions.svelte";

  export let song: Song;

  $: convertedPath = song.artPath ? convertFileSrc(song.artPath) : "";
  $: highlighted = $selected.includes(song.id);

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

<GridEntry label={song.title ?? song.fileName} {highlighted} gridSize={$songGridSize} convertedPath={convertedPath} on:click={onClick} on:hold={select}>
  <span slot="details">
    {#if $songSortOrder === "Alphabetical"}
      <div in:fade={{ duration: 200 }}>{song.artist ?? $t("UNKOWN_VALUE")}</div>
    {:else if $songSortOrder === "Album"}
      <div in:fade={{ duration: 200 }}>{song.album ?? $t("UNKOWN_VALUE")}</div>
    {:else if $songSortOrder === "Artist"}
      <div in:fade={{ duration: 200 }}>{song.artist ?? $t("UNKOWN_VALUE")}</div>
    {:else if $songSortOrder === "Year"}
      <div in:fade={{ duration: 200 }}>{song.releaseYear === -1 ? $t("UNKOWN_VALUE") : song.releaseYear}</div>
    {:else if $songSortOrder === "Most Played"}
      <div in:fade={{ duration: 200 }}>{song.numTimesPlayed}</div>
    {:else if $songSortOrder === "Last Played"}
      <div in:fade={{ duration: 200 }}>{song.lastPlayedOn === "Never" ? $t("NEVER_VALUE") : $renderDate(song.lastPlayedOn)}</div>
    {/if}
  </span>
  <span slot="options">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <SongOptions bind:menuIsOpen={menuIsOpen} song={song} />
    </MenuButton>
  </span>
</GridEntry>