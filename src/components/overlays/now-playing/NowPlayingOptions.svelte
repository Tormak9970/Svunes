<script lang="ts">
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import type { Song } from "@lib/models/Song";
  import { t } from "@stores/Locale";
  import { showAddToPlaylist, showCarMode, showMiniPlayer, showQueue, showSleepTimerSelection, songToAdd } from "@stores/Overlays";
  import { extraControl } from "@stores/State";
  import { goToSongDetails, goToSongEdit } from "@utils";
  import { push } from "svelte-spa-router";

  export let showQueueOption = false;
  export let showBothExtras = false;
  export let menuIsOpen: boolean;
  export let song: Song | undefined;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
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
   * Shows the current queue.
   */
  function goToQueue() {
    $showQueue = true;
    $showMiniPlayer = true;
    closeOptions();
  }

  /**
   * Shows the CarMode.
   */
  function goToCarMode() {
    $showCarMode = true;
    closeOptions();
  }

  /**
   * Shows the sleep selection timer.
   */
  function goToSleepTimer() {
    $showSleepTimerSelection = true;
    closeOptions();
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    $showMiniPlayer = true;
    push(`/albums/${song!.album!}`);
    closeOptions();
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    $showMiniPlayer = true;
    push(`/artists/${song!.artist!}`);
    closeOptions();
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    $showMiniPlayer = true;
    goToSongDetails(song!.id);
    closeOptions();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    $showMiniPlayer = true;
    goToSongEdit(song!.id);
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

{#if showQueueOption}
  <MenuItem on:click={goToQueue}>{$t("QUEUE_ACTION")}</MenuItem>
{/if}
{#if $extraControl === "Sleep Timer" ||  $extraControl === "None" || showBothExtras}
  <MenuItem on:click={goToCarMode}>{$t("CAR_MODE_ACTION")}</MenuItem>
{/if}
{#if $extraControl === "Car Mode" ||  $extraControl === "None" || showBothExtras}
  <MenuItem on:click={goToSleepTimer}>{$t("SLEEP_TIMER_ACTION")}</MenuItem>
{/if}
{#if song?.album}
  <MenuItem on:click={goToAlbum}>{$t("GO_TO_ALBUM_ACTION")}</MenuItem>
{/if}
{#if song?.artist}
  <MenuItem on:click={goToArtist}>{$t("GO_TO_ARTIST_ACTION")}</MenuItem>
{/if}
<MenuItem on:click={addToPlaylist}>{$t("ADD_TO_PLAYLIST_ACTION")}</MenuItem>
<MenuItem on:click={showDetails}>{$t("DETAILS_ACTION")}</MenuItem>
<MenuItem on:click={showSongEdit}>{$t("EDIT_ACTION")}</MenuItem>
<MenuItem on:click={share}>{$t("SHARE_ACTION")}</MenuItem>