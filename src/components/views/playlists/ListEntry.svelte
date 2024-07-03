<script lang="ts">
  import MenuButton from "@interactables/MenuButton.svelte";
  import Keep from "@ktibow/iconset-material-symbols/keep-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import CardClickable from "@layout/CardClickable.svelte";
  import type { Playlist } from "@lib/models/Playlist";
  import { LIST_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { renderDate } from "@lib/utils/Utils";
  import { inSelectMode, selected } from "@stores/Select";
  import { playlistSortOrder } from "@stores/State";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import Icon from "../../utils/Icon.svelte";
  import PlaylistImage from "./PlaylistImage.svelte";
  import PlaylistOptions from "./PlaylistOptions.svelte";

  export let playlist: Playlist;
  export let isSelectable = true;

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
    if (!$inSelectMode && isSelectable) {
      $selected = [ ...$selected, playlist.id ];
    }
  }
  
  let menuIsOpen = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="left">
      <PlaylistImage playlist={playlist} height={LIST_IMAGE_DIMENSIONS.height} width={LIST_IMAGE_DIMENSIONS.width} />
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
    </div>
    {#if !highlighted}
      <div class="options">
        <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
          <PlaylistOptions bind:menuIsOpen={menuIsOpen} playlist={playlist} />
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
    margin-left: 10px;
    display: flex;
    align-items: center;
    width: calc(100% - 40px);
  }

  .info {
    margin-left: 10px;
    max-width: calc(100% - 75px - 30px);
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