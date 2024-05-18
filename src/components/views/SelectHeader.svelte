<script lang="ts">
  import { View } from "../../types/View";
  import { fly } from "svelte/transition";
  import MenuButton from "../interactables/MenuButton.svelte";
  import { selected } from "../../stores/Select";
  import { showAddToPlaylist, albumViewing, playlistViewing, artistViewing, genreViewing } from "../../stores/Overlays";
  import { artistsMap, albumsMap, selectedView, playlistsMap, playlists, albums, songs, artists, genresMap } from "../../stores/State";
  import { LogController } from "../../lib/controllers/LogController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import { AppController } from "../../lib/controllers/AppController";
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back";
  import PlaylistAdd from "@ktibow/iconset-material-symbols/add-box-rounded";
  import QueueAdd from "@ktibow/iconset-material-symbols/playlist-add-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";

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
            songNames.push(...album.songKeys);
          }
        }
        break;
      }
      case View.ARTISTS: {
        if ($artistViewing) {
          songNames = $selected;
        } else {
          for (const artistName of $selected) {
            const artist = $artistsMap[artistName];
            songNames.push(...artist.songKeys);
          }
        }
        break;
      }
      case View.SONGS:
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
    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($playlistViewing) {
          QueueController.playSongsNext($selected);
        } else {
          QueueController.playPlaylistsNext($selected);
        }
        break;
      }
      case View.ALBUMS: {
        if ($albumViewing) {
          QueueController.playSongsNext($selected);
        } else {
          QueueController.playAlbumsNext($selected);
        }
        break;
      }
      case View.ARTISTS: {
        if ($artistViewing) {
          QueueController.playSongsNext($selected);
        } else {
          QueueController.playArtistsNext($selected);
        }
        break;
      }
      case View.SONGS:
      case View.GENRES: {
        QueueController.playSongsNext($selected);
        break;
      }
      case View.HOME:
      case View.SEARCH:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }

    $selected = [];
    menuIsOpen = false;
  }

  /**
   * Prompts the user to share the selected songs.
   */
  function share() {
    AppController.share(getSongsFromSelected());
    $selected = [];
    menuIsOpen = false;
  }

  /**
   * Prompts the user if they really want to delete everything they've selected.
   */
  function deleteFromDevice() {
    AppController.deleteSongsFromDevice(getSongsFromSelected());
    $selected = [];
    menuIsOpen = false;
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
          $selected = [ ...$albumsMap[$albumViewing].songKeys ];
        } else {
          $selected = $albums.map((album) => album.name);
        }
        break;
      }
      case View.SONGS: {
        $selected = $songs.map((song) => song.key);
        break;
      }
      case View.ARTISTS: {
        if ($artistViewing) {
          $selected = [ ...$artistsMap[$artistViewing].songKeys ];
        } else {
          $selected = $artists.map((artist) => artist.name);
        }
        break;
      }
      case View.GENRES: {
        $selected = [ ...$genresMap[$genreViewing!].songKeys ];
        break;
      }
      case View.SEARCH:
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
    menuIsOpen = false;
  }

  /**
   * Clears the selection.
   */
  function back() {
    $selected = [];
    menuIsOpen = false;
  }

  /**
   * Queues the selected items.
   */
  function queue() {
    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($playlistViewing) {
          QueueController.queueSongs($selected);
        } else {
          QueueController.queuePlaylists($selected);
        }
        break;
      }
      case View.ALBUMS: {
        if ($albumViewing) {
          QueueController.queueSongs($selected);
        } else {
          QueueController.queueAlbums($selected);
        }
        break;
      }
      case View.ARTISTS: {
        if ($artistViewing) {
          QueueController.playSongsNext($selected);
        } else {
          QueueController.queueArtists($selected);
        }
        break;
      }
      case View.SONGS:
      case View.GENRES: {
        QueueController.queueSongs($selected);
        break;
      }
      case View.HOME:
      case View.SEARCH:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
    $selected = [];
    menuIsOpen = false;
  }

  /**
   * Shows the add to playlist overlay.
   */
  function addToPlaylist() {
    $showAddToPlaylist = true;
    menuIsOpen = false;
  }

  let menuIsOpen = false;
</script>

<div class="select-header" transition:fly={{ y: -50, duration: 250 }}>
  <div class="left">
    <Button type="text" iconType="full" on:click={back}>
      <Icon icon={BackArrow} width="36px" height="36px" />
    </Button>
  </div>
  <div class="title">
    {$selected.length + " selected"}
  </div>
  <div class="right">
    <Button type="text" iconType="full" on:click={queue}>
      <Icon icon={QueueAdd} width="36px" height="36px" />
    </Button>
    <Button type="text" iconType="full" on:click={addToPlaylist}>
      <Icon icon={PlaylistAdd} width="36px" height="36px" />
    </Button>
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <Menu>
        <MenuItem on:click={playNext}>Play Next</MenuItem>
        <MenuItem on:click={share}>Share</MenuItem>
        <MenuItem on:click={deleteFromDevice}>Delete from Device</MenuItem>
        <MenuItem on:click={selectAll}>Select All</MenuItem>
      </Menu>
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
    
    background-color: rgb(var(--m3-scheme-surface-container-highest));

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
  }

  .right {
    height: 100%;
    margin-right: 10px;

    display: flex;
  }
</style>