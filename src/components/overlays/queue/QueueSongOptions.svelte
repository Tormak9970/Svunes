<script lang="ts">
  import { AppController } from "@controllers";
  import { MenuItem } from "@layout";
  import type { Song } from "@models";
  import { t } from "@stores/Locale";
  import { showAddToPlaylist, showQueue, songToAdd } from "@stores/Overlays";
  import { queue } from "@stores/State";
  import { goToSongDetails, goToSongEdit } from "@utils";
  import { push } from "svelte-spa-router";

  export let menuIsOpen: boolean;
  export let song: Song;
  export let index: number;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }

  /**
   * Removes this song from the queue.
   */
  function removeFromQueue() {
    $queue.splice(index, 1);

    $queue = [ ...$queue ];
    closeOptions();
  }

  /**
   * Opens the add to playlist dialog with this song set to be added.
   */
  function addToPlaylist() {
    $songToAdd = song!.id;
    $showAddToPlaylist = true;
    closeOptions();
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    push(`/albums/${song!.album!}`);
    $showQueue = false;
    closeOptions();
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    push(`/artists/${song!.artist!}`);
    $showQueue = false;
    closeOptions();
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    goToSongDetails(song!.id);
    $showQueue = false;
    closeOptions();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    goToSongEdit(song!.id);
    $showQueue = false;
    closeOptions();
  }

  /**
   * Opens the platform's share ui.
   */
  function share() {
    AppController.share([song!.id]);
    closeOptions();
  }
</script>

<MenuItem on:click={removeFromQueue}>{$t("REMOVE_FROM_QUEUE_ACTION")}</MenuItem>
<MenuItem on:click={addToPlaylist}>{$t("ADD_TO_PLAYLIST_ACTION")}</MenuItem>
{#if song?.album}
  <MenuItem on:click={goToAlbum}>{$t("GO_TO_ALBUM_ACTION")}</MenuItem>
{/if}
{#if song?.artist}
  <MenuItem on:click={goToArtist}>{$t("GO_TO_ARTIST_ACTION")}</MenuItem>
{/if}
<MenuItem on:click={showDetails}>{$t("DETAILS_ACTION")}</MenuItem>
<MenuItem on:click={showSongEdit}>{$t("EDIT_ACTION")}</MenuItem>
<MenuItem on:click={share}>{$t("SHARE_ACTION")}</MenuItem>