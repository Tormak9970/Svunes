<script lang="ts">
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import { EditController } from "@lib/controllers/EditController";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import { QueueController } from "@lib/controllers/QueueController";
  import type { Playlist } from "@lib/models/Playlist";
  import { t } from "@stores/Locale";
  import { playlistToAdd, showAddToPlaylist } from "@stores/Overlays";
  import { playlists } from "@stores/State";
  import * as dialog from "@tauri-apps/plugin-dialog";
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
  async function exportPlaylist() {
    menuIsOpen = false;
    const path = await dialog.save({
      title: `${$t("EXPORT_ACTION")} ${playlist.name}`,
      defaultPath: `${playlist.id}.json`,
      filters: [
        {
          "name": $t("PLAYLIST_SINGULAR_VALUE"),
          "extensions": [ "json" ]
        }
      ]
    });

    if (path && path !== "") {
      AppController.exportPlaylist(path, playlist);
    }
  }
</script>

<MenuItem on:click={playPlaylist}>{$t("PLAY_ACTION")}</MenuItem>
<MenuItem on:click={playNext}>{$t("PLAY_NEXT_ACTION")}</MenuItem>
<MenuItem on:click={queuePlaylist}>{$t("ADD_TO_QUEUE_ACTION")}</MenuItem>
<MenuItem on:click={addToPlaylist}>{$t("ADD_TO_PLAYLISTS_ACTION")}</MenuItem>
<MenuItem on:click={togglePinned}>{$t(playlist?.pinned ? "UNPIN_ACTION" : "PIN_ACTION")}</MenuItem>
{#if playlist.isUserPlaylist}
  <MenuItem on:click={showPlaylistEdit}>{$t("EDIT_ACTION")}</MenuItem>
  <MenuItem on:click={deletePlaylist}>{$t("DELETE_ACTION")}</MenuItem>
{/if}
<MenuItem on:click={exportPlaylist}>{$t("EXPORT_ACTION")}</MenuItem>