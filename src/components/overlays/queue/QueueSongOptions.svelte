<script lang="ts">
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import type { Song } from "@lib/models/Song";
  import { showAddToPlaylist, showQueue, songToAdd } from "@stores/Overlays";
  import { queue } from "@stores/State";
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
    push(`/songs/${song!.id}`);
    $showQueue = false;
    closeOptions();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    push(`/songs/${song!.id}/edit`);
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

<MenuItem on:click={removeFromQueue}>Remove from Queue</MenuItem>
<MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
{#if song?.album}
  <MenuItem on:click={goToAlbum}>Go to Album</MenuItem>
{/if}
{#if song?.artist}
  <MenuItem on:click={goToArtist}>Go to Artist</MenuItem>
{/if}
<MenuItem on:click={showDetails}>Details</MenuItem>
<MenuItem on:click={showSongEdit}>Edit</MenuItem>
<MenuItem on:click={share}>Share</MenuItem>