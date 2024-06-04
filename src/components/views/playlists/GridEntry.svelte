<script lang="ts">
  import type { Playlist } from "../../../lib/models/Playlist";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { GRID_IMAGE_DIMENSIONS } from "../../../lib/utils/ImageConstants";
  import { playlistGridSize, playlistSortOrder } from "../../../stores/State";
  import { fade } from "svelte/transition";
  import { renderDate } from "../../../lib/utils/Utils";
  import CardClickable from "../../layout/CardClickable.svelte";
  import { push } from "svelte-spa-router";
  import PlaylistImage from "./PlaylistImage.svelte";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Keep from "@ktibow/iconset-material-symbols/keep-rounded";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import PlaylistOptions from "./PlaylistOptions.svelte";
  import Icon from "../../utils/Icon.svelte";
  import { GridSize } from "../../../types/Settings";

  export let playlist: Playlist;

  $: highlighted = $selected.includes(playlist.name);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    if ($inSelectMode) {
      const nameIndex = $selected.indexOf(playlist.name);
      if (nameIndex !== -1) {
        $selected.splice(nameIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, playlist.name ];
      }
    } else {
      push(`/playlists/${playlist.name}`);
    }
  }

  /**
   * Handles when the user selects the entry.
   */
  function select() {
    if (!$inSelectMode) {
      $selected = [ ...$selected, playlist.name ];
    }
  }
  
  let menuIsOpen = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:highlight={highlighted}>
    <PlaylistImage playlist={playlist} height={GRID_IMAGE_DIMENSIONS[$playlistGridSize].height} width={GRID_IMAGE_DIMENSIONS[$playlistGridSize].width} />
    <div class="bottom" style="height: {GRID_IMAGE_DIMENSIONS[$playlistGridSize].infoHeight}px;">
      <div class="info">
        <div class="name">
          {playlist.name}
        </div>
        <div class="secondary">
          {#if playlist.pinned}
            <div class="pinned-container">
              <Icon icon={Keep} width="16px" height="16px" />
            </div>
          {/if}
          {#if $playlistSortOrder === "Alphabetical" || $playlistSortOrder === "Song Count"}
            <div in:fade={{ duration: 200 }}>{playlist.songIds.length === 1 ? `1 Song` : `${playlist.songIds.length} Songs`} • {playlist.displayLength()}</div>
          {:else if $playlistSortOrder === "Most Played"}
            <div in:fade={{ duration: 200 }}>Played {playlist.numTimesPlayed} Times</div>
          {:else if $playlistSortOrder === "Last Played"}
            <div in:fade={{ duration: 200 }}>{playlist.lastPlayedOn === "Never" ? "Never" : renderDate(playlist.lastPlayedOn)}</div>
          {/if}
        </div>
      </div>
      {#if !highlighted && $playlistGridSize === GridSize.LARGE}
        <div class="options">
          <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
            <PlaylistOptions bind:menuIsOpen={menuIsOpen} playlist={playlist} />
          </MenuButton>
        </div>
      {/if}
    </div>
  </div>
</CardClickable>

<style>
  .content {
    width: 100%; 
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bottom {
    padding-top: 9px;
    padding-bottom: 4px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    width: calc(100% - 40px);
    margin-left: 5px;
  }

  .name {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 16px;
  }

  .secondary > div {
    font-size: 14px;
    color: rgb(var(--m3-scheme-outline));
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary > div.pinned-container {
    color: rgb(var(--m3-scheme-primary));
    transform: rotate(45deg);
  }
</style>