<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import Keep from "@ktibow/iconset-material-symbols/keep-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import GridEntry from "@layout/entries/GridEntry.svelte";
  import type { Playlist } from "@lib/models/Playlist";
  import { renderDate, t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { playlistGridSize, playlistSortOrder } from "@stores/State";
  import { GRID_IMAGE_DIMENSIONS } from "@utils";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import PlaylistImage from "./PlaylistImage.svelte";
  import PlaylistOptions from "./PlaylistOptions.svelte";

  export let playlist: Playlist;

  $: highlighted = $selected.includes(playlist.id);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    if ($inSelectMode) {
      const nameIndex = $selected.indexOf(playlist.id);
      if (nameIndex !== -1) {
        $selected.splice(nameIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, playlist.id ];
      }
    } else {
      push(`/playlists/${playlist.id}`);
    }
  }

  /**
   * Handles when the user selects the entry.
   */
  function select() {
    if (!$inSelectMode) {
      $selected = [ ...$selected, playlist.id ];
    }
  }
  
  let menuIsOpen = false;
</script>

<GridEntry label={playlist.name} {highlighted} gridSize={$playlistGridSize} convertedPath={""} on:click={onClick} on:hold={select}>
  <span slot="playlistImage">
    <PlaylistImage playlist={playlist} height={GRID_IMAGE_DIMENSIONS[$playlistGridSize].height} width={GRID_IMAGE_DIMENSIONS[$playlistGridSize].width} />
  </span>
  <span slot="details">
    {#if playlist.pinned}
      <div class="pinned-container">
        <Icon icon={Keep} width="16px" height="16px" />
      </div>
    {/if}
    {#if $playlistSortOrder === "Alphabetical" || $playlistSortOrder === "Song Count"}
      <div in:fade={{ duration: 200 }}>{playlist.songIds.length} {playlist.songIds.length === 1 ? $t("SONG_SINGULAR_VALUE") : $t("SONG_PLURAL_VALUE")} • {playlist.displayLength()}</div>
    {:else if $playlistSortOrder === "Most Played"}
      <div in:fade={{ duration: 200 }}>{$t("PLAYED_TIMES_MESSAGE").replace("{numTimes}", playlist.numTimesPlayed.toString())}</div>
    {:else if $playlistSortOrder === "Last Played"}
      <div in:fade={{ duration: 200 }}>{playlist.lastPlayedOn === "Never" ? $t("NEVER_VALUE") : $renderDate(playlist.lastPlayedOn)}</div>
    {/if}
  </span>
  <span slot="options">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <PlaylistOptions bind:menuIsOpen={menuIsOpen} playlist={playlist} />
    </MenuButton>
  </span>
</GridEntry>

<style>
  span[slot="details"] {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  span[slot="details"] > div {
    color: rgb(var(--m3-scheme-outline));
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  span[slot="details"] > div.pinned-container {
    color: rgb(var(--m3-scheme-primary));
    transform: rotate(45deg);
  }
</style>