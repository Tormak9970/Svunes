<script lang="ts">
  import ViewImage from "@component-utils/ViewImage.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import CardClickable from "@layout/CardClickable.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import type { Song } from "@lib/models/Song";
  import { LIST_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { renderDate, t } from "@stores/Locale";
  import { inSelectMode, selected } from "@stores/Select";
  import { tauri } from "@tauri-apps/api";
  import { fade } from "svelte/transition";
  import type { SongSortOrder } from "../../../types/Settings";
  import SongOptions from "./SongOptions.svelte";

  export let song: Song;
  export let detailType: SongSortOrder;
  export let isSelectable = true;

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
    if (!$inSelectMode && isSelectable) {
      $selected = [ ...$selected, song.id ];
    }
  }

  let menuIsOpen = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:in-select-mode={$inSelectMode}>
    <div class="left">
      <ViewImage src={convertedPath} width={LIST_IMAGE_DIMENSIONS.width} height={LIST_IMAGE_DIMENSIONS.height} borderRadius="4px" marginLeft="10px" />
      <div class="info">
        <div class="name">
          {song.title ?? song.fileName}
        </div>
        <div class="secondary">
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
    max-width: calc(100% - 75px - 30px);
    margin-left: 15px;
  }

  .in-select-mode .left {
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