<script lang="ts">
  import { PlaybackController } from "@controllers";
  import { MoreVert } from "@icons";
  import { MenuButton } from "@interactables";
  import { ListEntry } from "@layout";
  import type { Song } from "@models";
  import { renderDate, t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import type { SongSortOrder } from "@types";
  import { location } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import SongOptions, { getContextMenuItems } from "./SongOptions.svelte";

  export let song: Song;
  export let detailType: SongSortOrder;
  export let isSelectable = true;

  $: convertedPath = song.artPath ? convertFileSrc(song.artPath) : "";
  $: highlighted = $selected.includes(song.id);
  
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
    $selected = [ ...$selected, song.id ];
  }

  let menuIsOpen = false;
</script>

<ListEntry
  label={song.title ?? song.fileName}
  convertedPath={convertedPath}
  highlighted={highlighted}
  holdable={!$inSelectMode && isSelectable}
  ctxMenuId="song-options"
  ctxMenuItems={ctxMenuItems}
  on:click={onClick}
  on:hold={select}
>
  <span slot="details">
    {#if detailType === "Alphabetical"}
      <div in:fade={{ duration: 200 }}>{song.artist ?? $t("UNKOWN_VALUE")}</div>
    {:else if detailType === "Album"}
      <div in:fade={{ duration: 200 }}>{song.album ?? $t("UNKOWN_VALUE")}</div>
    {:else if detailType === "Artist"}
      <div in:fade={{ duration: 200 }}>{song.artist ?? $t("UNKOWN_VALUE")}</div>
    {:else if detailType === "Year"}
      <div in:fade={{ duration: 200 }}>{song.releaseYear === -1 ? $t("UNKOWN_VALUE") : song.releaseYear}</div>
    {:else if detailType === "Most Played"}
      <div in:fade={{ duration: 200 }}>{song.numTimesPlayed}</div>
    {:else if detailType === "Last Played"}
      <div in:fade={{ duration: 200 }}>{song.lastPlayedOn === "Never" ? $t("NEVER_VALUE") : $renderDate(song.lastPlayedOn)}</div>
    {/if}
  </span>
  <span slot="options">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <SongOptions bind:menuIsOpen={menuIsOpen} song={song} />
    </MenuButton>
  </span>
</ListEntry>