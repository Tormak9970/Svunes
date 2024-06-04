<script lang="ts">
  import { AppController } from "../../../lib/controllers/AppController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import { showAddToPlaylist, songToAdd } from "../../../stores/Overlays";
  import { location, push, replace } from "svelte-spa-router";
  import MenuItem from "../../layout/MenuItem.svelte";
  import type { Song } from "../../../lib/models/Song";
  import { playlists, playlistsMap } from "../../../stores/State";
  import { EditController } from "../../../lib/controllers/EditController";

  export let menuIsOpen: boolean;
  export let song: Song;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }

  /**
   * Removes this song from the current playlist.
   */
  function removeFromPlaylist() {
    const id = $location.slice(11);
    const playlist = $playlistsMap[id];

    playlist.removeSong(song.id);
    
    $playlists = [ ...$playlists ];
    closeOptions();
  }

  /**
   * Plays this song next.
   */
  function playNext() {
    QueueController.playSongsNext([song!.id]);
    closeOptions();
  }

  /**
   * Queues this song.
   */
  function queueSong() {
    QueueController.queueSongs([song!.id]);
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
    closeOptions();
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    push(`/artists/${song!.artist!}`);
    closeOptions();
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    push(`/songs/${song!.id}`);
    closeOptions();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
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

  /**
   * Prompts the user to confirm if they want to delete this song.
   */
  function deleteSong() {
    EditController.deleteSongsFromDevice([song!.id]);
    closeOptions();
    if ($location.startsWith("/songs/")) replace("/songs");
  }
</script>

{#if $location.startsWith("/playlists")}
<MenuItem on:click={removeFromPlaylist}>Remove from Playlist</MenuItem>
{/if}
<MenuItem on:click={playNext}>Play Next</MenuItem>
<MenuItem on:click={queueSong}>Add to Queue</MenuItem>
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
<MenuItem on:click={deleteSong}>Delete</MenuItem>