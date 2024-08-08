<script lang="ts">
  import { PlaybackController } from "@controllers";
  import { MoreVert } from "@icons";
  import { MenuButton } from "@interactables";
  import type { Song } from "@models";
  import { t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { getSelectContextMenuItems } from "@views/SelectHeader.svelte";
  import SongOptions, { getContextMenuItems } from "@views/songs/SongOptions.svelte";
  import { location } from "svelte-spa-router";
  import ListEntry from "../entries/ListEntry.svelte";

  export let song: Song;

  $: convertedPath = song.artPath ? convertFileSrc(song.artPath) : "";
  $: highlighted = $selected.includes(song.id);

  $: selectCtxItems = getSelectContextMenuItems($t);
  $: ctxMenuItems = getContextMenuItems(song, $t, $location);

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

<ListEntry
  label={song.title ?? song.fileName}
  convertedPath={convertedPath}
  highlighted={highlighted}
  ctxMenuId={"song-options"}
  ctxMenuItems={highlighted ? selectCtxItems : ctxMenuItems}
  isSongEntry
  on:click={onClick}
  on:hold={select}
>
  <span slot="details">
    <div class="artist">
      {song.artist ?? $t("UNKOWN_VALUE")}
    </div>
    <div class="other">
      {song.trackNumber ? song.trackNumber + " | " : ""}{song.displayLength()}
    </div>
  </span>
  <span slot="options">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <SongOptions bind:menuIsOpen={menuIsOpen} song={song} />
    </MenuButton>
  </span>
</ListEntry>

<style>
  span[slot="details"] {
    color: rgb(var(--m3-scheme-outline));
    
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>