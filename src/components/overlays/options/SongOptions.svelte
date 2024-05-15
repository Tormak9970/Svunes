<script lang="ts">
  import { AppController } from "../../../lib/controllers/AppController";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import type { Song } from "../../../lib/models/Song";
  import { showAddToPlaylist, showSongDetails, songToAdd, albumViewing, artistViewing, songViewing, showEditSong, showAlbumDetails, showSongOptions } from "../../../stores/Overlays";
  import { songsMap } from "../../../stores/State";
  import BottomSheet from "../../layout/BottomSheet.svelte";

  $: song = $songViewing ? $songsMap[$songViewing] : null;

  function closeOptions() {
    $songViewing = null;
    $showSongOptions = false;
  }

  function addToPlaylist() {
    $songToAdd = song!.title;
    $showAddToPlaylist = true;
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    $albumViewing = song!.album;
    $showAlbumDetails = true;
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    $artistViewing = song!.artist;
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    $showSongDetails = true;
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    $showEditSong = true;
  }
</script>

{#if $showSongOptions}
  <BottomSheet on:close={closeOptions}>
    This is a test!
  </BottomSheet>
{/if}

<!-- <md-menu-item style="width: 180px;" on:click={() => PlaybackController.playSong(song)}>
  <div slot="headline">Play</div>
</md-menu-item>
<md-menu-item on:click={() => QueueController.playNext([song.title])}>
  <div slot="headline">Play Next</div>
</md-menu-item>
<md-menu-item on:click={() => QueueController.queueSongs([song.title])}>
  <div slot="headline">Add to queue</div>
</md-menu-item>
<md-menu-item on:click={addToPlaylist}>
  <div slot="headline">Add to playlist</div>
</md-menu-item>
{#if song.album}
  <md-menu-item on:click={goToAlbum}>
    <div slot="headline">Go to album</div>
  </md-menu-item>
{/if}
{#if song.artist}
  <md-menu-item on:click={goToArtist}>
    <div slot="headline">Go to artist</div>
  </md-menu-item>
{/if}
<md-menu-item on:click={showDetails}>
  <div slot="headline">Details</div>
</md-menu-item>
<md-menu-item on:click={showSongEdit}>
  <div slot="headline">Edit</div>
</md-menu-item>
<md-menu-item on:click={() => AppController.share([song.title])}>
  <div slot="headline">Share</div>
</md-menu-item>
<md-menu-item on:click={() => AppController.deleteFromDevice([song.title])}>
  <div slot="headline">Delete from device</div>
</md-menu-item> -->