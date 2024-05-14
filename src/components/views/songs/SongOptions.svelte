<script lang="ts">
  import { AppController } from "../../../lib/controllers/AppController";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import type { Song } from "../../../lib/models/Song";
  import { showAddToPlaylist, showSongDetails, songToAdd, albumViewing, artistViewing, songViewing, showEditSong, showAlbumDetails } from "../../../stores/Overlays";

  export let song: Song;

  function addToPlaylist() {
    $songToAdd = song.title;
    $showAddToPlaylist = true;
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    $albumViewing = song.album;
    $showAlbumDetails = true;
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    $artistViewing = song.artist;
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    $songViewing = song.title;
    $showSongDetails = true;
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    $songViewing = song.title;
    $showEditSong = true;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item style="width: 180px;" on:click={() => PlaybackController.playSong(song)}>
  <div slot="headline">Play</div>
</md-menu-item>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={() => QueueController.playNext([song.title])}>
  <div slot="headline">Play Next</div>
</md-menu-item>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={() => QueueController.queueSongs([song.title])}>
  <div slot="headline">Add to queue</div>
</md-menu-item>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={addToPlaylist}>
  <div slot="headline">Add to playlist</div>
</md-menu-item>
{#if song.album}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <md-menu-item on:click={goToAlbum}>
    <div slot="headline">Go to album</div>
  </md-menu-item>
{/if}
{#if song.artist}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <md-menu-item on:click={goToArtist}>
    <div slot="headline">Go to artist</div>
  </md-menu-item>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={showDetails}>
  <div slot="headline">Details</div>
</md-menu-item>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={showSongEdit}>
  <div slot="headline">Edit</div>
</md-menu-item>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={() => AppController.share([song.title])}>
  <div slot="headline">Share</div>
</md-menu-item>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-menu-item on:click={() => AppController.deleteFromDevice([song.title])}>
  <div slot="headline">Delete from device</div>
</md-menu-item>