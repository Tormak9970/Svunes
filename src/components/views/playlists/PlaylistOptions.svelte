<script lang="ts">
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import { EditController } from "@lib/controllers/EditController";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import { QueueController } from "@lib/controllers/QueueController";
  import type { Playlist } from "@lib/models/Playlist";
  import { playlistToAdd, showAddToPlaylist } from "@stores/Overlays";
  import { playlists } from "@stores/State";
  import { location, push, replace } from "svelte-spa-router";

  export let menuIsOpen: boolean;
  export let playlist: Playlist;

  /**
   * Plays this playlist.
   */
  function playPlaylist() {
    menuIsOpen = false;
    PlaybackController.playPlaylist(playlist);
  }

  /**
   * Plays this playlist next.
   */
  function playNext() {
    menuIsOpen = false;
    QueueController.playPlaylistsNext([playlist.id]);
  }

  /**
   * Queues this playlist.
   */
  function queuePlaylist() {
    menuIsOpen = false;
    QueueController.queuePlaylists([playlist.id]);
  }

  /**
   * Opens the add to playlist dialog with this playlist set to be added.
   */
  function addToPlaylist() {
    menuIsOpen = false;
    $playlistToAdd = playlist.id;
    $showAddToPlaylist = true;
  }

  /**
   * Toggles whether the playlist is pinned or not.
   */
  function togglePinned() {
    playlist.pinned = !playlist.pinned;
    $playlists = [ ...$playlists ];
    menuIsOpen = false;
  }

  /**
   * Shows the edit playlist overlay.
   */
  function showPlaylistEdit() {
    menuIsOpen = false;
    push(`/playlists/${playlist.id}/edit`);
  }

  /**
   * Prompts the user to confirm if they want to delete this song.
   */
  function deletePlaylist() {
    menuIsOpen = false;
    EditController.deletePlaylistsFromDevice([playlist.id]);
    if ($location.startsWith("/playlists/")) replace("/playlists");
  }

  /**
   * Exports the playlist to a json file.
   */
  function exportPlaylist() {
    menuIsOpen = false;
    AppController.exportPlaylist(playlist);
  }
</script>

<MenuItem on:click={playPlaylist}>Play</MenuItem>
<MenuItem on:click={playNext}>Play Next</MenuItem>
<MenuItem on:click={queuePlaylist}>Add to Queue</MenuItem>
<MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
<MenuItem on:click={togglePinned}>{playlist?.pinned ? "Unpin" : "Pin"}</MenuItem>
{#if playlist.isUserPlaylist}
  <MenuItem on:click={showPlaylistEdit}>Edit</MenuItem>
  <MenuItem on:click={deletePlaylist}>Delete</MenuItem>
{/if}
<MenuItem on:click={exportPlaylist}>Export</MenuItem>