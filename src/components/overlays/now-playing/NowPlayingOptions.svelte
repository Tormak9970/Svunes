<script lang="ts">
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import type { Song } from "@lib/models/Song";
  import { showAddToPlaylist, showMiniPlayer, songToAdd } from "@stores/Overlays";
  import { push } from "svelte-spa-router";

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
    push(`/songs/${song!.id}`);
    closeOptions();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    $showMiniPlayer = true;
    push(`/songs/${song!.id}/edit`);
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

{#if song?.album}
  <MenuItem on:click={goToAlbum}>Go to Album</MenuItem>
{/if}
{#if song?.artist}
  <MenuItem on:click={goToArtist}>Go to Artist</MenuItem>
{/if}
<MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
<MenuItem on:click={showDetails}>Details</MenuItem>
<MenuItem on:click={showSongEdit}>Edit</MenuItem>
<MenuItem on:click={share}>Share</MenuItem>