<script lang="ts">
  import { AppController } from "../../../lib/controllers/AppController";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import { playlistToAdd, showAddToPlaylist, songToAdd } from "../../../stores/Overlays";
  import { push } from "svelte-spa-router";
  import MenuItem from "../../layout/MenuItem.svelte";
  import type { Playlist } from "../../../lib/models/Playlist";
    import { playlists } from "../../../stores/State";

  export let menuIsOpen: boolean;
  export let playlist: Playlist;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }

  /**
   * Plays this playlist.
   */
  function playPlaylist() {
    PlaybackController.playPlaylist(playlist);
    closeOptions();
  }

  /**
   * Plays this playlist next.
   */
  function playNext() {
    QueueController.playPlaylistsNext([playlist.name]);
    closeOptions();
  }

  /**
   * Queues this playlist.
   */
  function queuePlaylist() {
    QueueController.queuePlaylists([playlist.name]);
    closeOptions();
  }

  /**
   * Opens the add to playlist dialog with this playlist set to be added.
   */
  function addToPlaylist() {
    $playlistToAdd = playlist.name;
    $showAddToPlaylist = true;
    closeOptions();
  }

  /**
   * Toggles whether the playlist is pinned or not.
   */
  function togglePinned() {
    playlist.pinned = !playlist.pinned;
    $playlists = [ ...$playlists ];
    closeOptions();
  }

  /**
   * Shows the edit playlist overlay.
   */
  function showPlaylistEdit() {
    push(`/playlists/${playlist.name}/edit`);
    closeOptions();
  }

  /**
   * Prompts the user to confirm if they want to delete this song.
   */
  function deletePlaylist() {
    AppController.deletePlaylistsFromDevice([playlist.name]);
    closeOptions();
  }

  /**
   * Exports the playlist to a json file.
   */
  function exportPlaylist() {
    AppController.exportPlaylist(playlist);
    closeOptions();
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