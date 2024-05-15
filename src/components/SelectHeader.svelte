<script lang="ts">
  import { View } from "../types/View";
  import { fly } from "svelte/transition";
  import MenuButton from "./interactables/MenuButton.svelte";
  import { selected } from "../stores/Select";
  import { showAddToPlaylist, albumViewing, playlistViewing, artistViewing, genreViewing } from "../stores/Overlays";
  import { artistsMap, albumsMap, selectedView, playlistsMap, playlists, albums, songs, artists, genresMap } from "../stores/State";
  import { LogController } from "../lib/controllers/LogController";
  import { QueueController } from "../lib/controllers/QueueController";
  import { AppController } from "../lib/controllers/AppController";

  /**
   * Gets the names of the songs from the selected items.
   */
  function getSongsFromSelected(): string[] {
    let songNames: string[] = [];

    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($playlistViewing) {
          songNames = $selected;
        } else {
          for (const playlistName of $selected) {
            const playlist = $playlistsMap[playlistName];
            songNames.push(...playlist.songNames);
          }
        }
        break;
      }
      case View.ALBUMS: {
        if ($albumViewing) {
          songNames = $selected;
        } else {
          for (const albumName of $selected) {
            const album = $albumsMap[albumName];
            songNames.push(...album.songNames);
          }
        }
        break;
      }
      case View.SONGS: {
        songNames = $selected;
        break;
      }
      case View.ARTISTS: {
        if ($artistViewing) {
          songNames = $selected;
        } else {
          for (const artistName of $selected) {
            const artist = $artistsMap[artistName];
            songNames.push(...artist.songNames);
          }
        }
        break;
      }
      case View.GENRES: {
        songNames = $selected;
        break;
      }
      case View.HOME:
      case View.SEARCH:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }

    return songNames;
  }

  /**
   * Sets the selected items to be played next.
   */
  function playNext() {
    QueueController.playNext(getSongsFromSelected());
    $selected = [];
  }

  /**
   * Prompts the user to share the selected songs.
   */
  function share() {
    AppController.share(getSongsFromSelected());
    $selected = [];
  }

  /**
   * Prompts the user if they really want to delete everything they've selected.
   */
  function deleteFromDevice() {
    AppController.deleteFromDevice(getSongsFromSelected());
    $selected = [];
  }

  /**
   * Selects everything.
   */
  function selectAll() {
    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($playlistViewing) {
          $selected = [ ...$playlistsMap[$playlistViewing].songNames ];
        } else {
          $selected = $playlists.map((playlist) => playlist.name);
        }
        break;
      }
      case View.ALBUMS: {
        if ($albumViewing) {
          $selected = [ ...$albumsMap[$albumViewing].songNames ];
        } else {
          $selected = $albums.map((album) => album.name);
        }
        break;
      }
      case View.SONGS: {
        $selected = $songs.map((song) => song.title);
        break;
      }
      case View.ARTISTS: {
        if ($artistViewing) {
          $selected = [ ...$artistsMap[$artistViewing].songNames ];
        } else {
          $selected = $artists.map((artist) => artist.name);
        }
        break;
      }
      case View.GENRES: {
        $selected = [ ...$genresMap[$genreViewing!].songNames ];
        break;
      }
      case View.SEARCH:
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
  }

  /**
   * Clears the selection.
   */
  function back() {
    $selected = [];
  }

  /**
   * Queues the selected items.
   */
  function queue() {
    QueueController.queueSongs(getSongsFromSelected());
    $selected = [];
  }

  /**
   * Shows the add to playlist overlay.
   */
  function addToPlaylist() {
    $showAddToPlaylist = true;
  }
</script>

<div class="select-header" transition:fly={{ y: -50, duration: 250 }}>
  <div class="left">
    <IconButton onClick={back}>
      <!-- <BackArrow /> -->
    </IconButton>
  </div>
  <div class="title">
    {$selected.length + " selected"}
  </div>
  <div class="right">
    <IconButton onClick={queue}>
      <!-- <AddBox /> -->
    </IconButton>
    <IconButton onClick={addToPlaylist}>
      <!-- <PlaylistAdd /> -->
    </IconButton>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <MenuButton>
      <span slot="icon">
        <!-- <MoreVert /> -->
      </span>
      <md-menu-item style="width: 180px;" on:click={playNext}>
        <div slot="headline">Play Next</div>
      </md-menu-item>
      <md-menu-item on:click={share}>
        <div slot="headline">Share</div>
      </md-menu-item>
      <md-menu-item on:click={deleteFromDevice}>
        <div slot="headline">Delete from Device</div>
      </md-menu-item>
      <md-menu-item on:click={selectAll}>
        <div slot="headline">Select All</div>
      </md-menu-item>
    </MenuButton>
  </div>
</div>

<style>
  .select-header {
    padding: 5px 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    background-color: var(--md-sys-color-surface-container-highest);

    position: absolute;
    top: 0;

    z-index: 2;
  }

  .title {
    font-size: 20px;
  }

  .left {
    height: 100%;
    margin-left: 10px;
    color: var(--md-sys-color-on-surface-variant);
  }

  .right {
    height: 100%;
    margin-right: 10px;
    color: var(--md-sys-color-on-surface-variant);

    display: flex;
  }
</style>