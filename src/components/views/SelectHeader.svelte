<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import QueueAdd from "@ktibow/iconset-material-symbols/add-to-queue-outline-rounded";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import PlaylistAdd from "@ktibow/iconset-material-symbols/playlist-add-rounded";
  import PlaylistRemove from "@ktibow/iconset-material-symbols/playlist-remove-rounded";
  import QueueRemove from "@ktibow/iconset-material-symbols/remove-from-queue-outline-rounded";
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import { EditController } from "@lib/controllers/EditController";
  import { QueueController } from "@lib/controllers/QueueController";
  import { LogController } from "@lib/controllers/utils/LogController";
  import t from "@lib/utils/i18n";
  import { showAddToPlaylist, showQueue } from "@stores/Overlays";
  import { bulkEditSongIds, selected } from "@stores/Select";
  import { albums, albumsMap, artists, artistsMap, genresMap, playlists, playlistsMap, queue, selectedView, showInfoSnackbar, songIdsToParse, songs } from "@stores/State";
  import { location, push } from "svelte-spa-router";
  import { fly } from "svelte/transition";
  import { View } from "../../types/View";

  /**
   * Gets the ids of the songs from the selected items.
   */
  function getSongsFromSelected(): string[] {
    let songIds: string[] = [];

    if ($showQueue) {
      songIds = $selected.map((merged) => merged.split("|")[0]);
      return songIds;
    }

    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          for (const id of $selected) {
            const playlist = $playlistsMap[id];
            songIds.push(...playlist.songIds);
          }
        } else {
          songIds = $selected;
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          for (const albumName of $selected) {
            const album = $albumsMap[albumName];
            songIds.push(...album.songIds);
          }
        } else {
          songIds = $selected;
        }
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          for (const artistName of $selected) {
            const artist = $artistsMap[artistName];
            songIds.push(...artist.songIds);
          }
        } else {
          songIds = $selected;
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        songIds = $selected;
        break;
      }
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }

    return songIds;
  }

  /**
   * Sets the selected items to be played next.
   */
  function playNext() {
    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          QueueController.playPlaylistsNext($selected);
        } else {
          QueueController.playSongsNext($selected);
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          QueueController.playAlbumsNext($selected);
        } else {
          QueueController.playSongsNext($selected);
        }
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          QueueController.playArtistsNext($selected);
        } else {
          QueueController.playSongsNext($selected);
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        QueueController.playSongsNext($selected);
        break;
      }
      case View.HOME:
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
    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          const toDelete = $selected.filter((id) => $playlistsMap[id].isUserPlaylist);
          if (toDelete.length > 0) EditController.deletePlaylistsFromDevice(toDelete);
        } else {
          EditController.deleteSongsFromDevice($selected);
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          EditController.deleteAlbumsFromDevice($selected);
        } else {
          EditController.deleteSongsFromDevice($selected);
        }
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          LogController.error("Shouldn't be able to get here!");
        } else {
          EditController.deleteSongsFromDevice($selected);
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        EditController.deleteSongsFromDevice($selected);
        break;
      }
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
    
    $selected = [];
    menuIsOpen = false;
  }

  /**
   * Selects everything.
   */
  function selectAll() {
    menuIsOpen = false;

    if ($showQueue) {
      $selected = $queue.map((songId, i) => songId + "|" + i);
      return;
    }

    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          $selected = $playlists.map((playlist) => playlist.id);
        } else {
          const playlistId = $location.substring(11);
          $selected = [ ...$playlistsMap[playlistId].songIds ];
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          $selected = $albums.map((album) => album.name);
        } else {
          const albumName = $location.substring(8).replaceAll("%20", " ");
          $selected = [ ...$albumsMap[albumName].songIds ];
        }
        break;
      }
      case View.SONGS: {
        $selected = $songs.map((song) => song.id);
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          $selected = $artists.map((artist) => artist.name);
        } else {
          const artistName = $location.substring(9).replaceAll("%20", " ");
          $selected = [ ...$artistsMap[artistName].songIds ];
        }
        break;
      }
      case View.GENRES: {
        const genreName = $location.substring(8).replaceAll("%20", " ");
        $selected = [ ...$genresMap[genreName].songIds ];
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
    menuIsOpen = false;
  }

  /**
   * Queues the selected items.
   */
  function addToQueue() {
    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          QueueController.queuePlaylists($selected);
        } else {
          QueueController.queueSongs($selected);
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          QueueController.queueAlbums($selected);
        } else {
          QueueController.queueSongs($selected);
        }
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          QueueController.queueArtists($selected);
        } else {
          QueueController.playSongsNext($selected);
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        QueueController.queueSongs($selected);
        break;
      }
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
    $selected = [];
    menuIsOpen = false;
  }

  /**
   * Removes the selected items from the queue.
   */
  function removeFromQueue() {
    for (const merged of $selected) {
      const [_, index] = merged.split("|");

      !$queue.splice(parseInt(index), 1);
    }

    $queue = [ ...$queue ];
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

  /**
   * Shows the metadata parser.
   */
  function goToInfoParser() {
    $songIdsToParse = getSongsFromSelected();
    push("/metadata-parser");
    menuIsOpen = false;
    back();
  }

  /**
   * Shows the bulk edit page.
   */
  function goToBulkEdit() {
    $bulkEditSongIds = getSongsFromSelected();
    push("/songs/bulk-edit");
    menuIsOpen = false;
    back();
  }

  /**
   * Removes the selected songs from this playlist.
   */
  function removeFromPlaylist() {
    const playlistId = $location.substring(11);
    const playlist = $playlistsMap[playlistId];
    
    for (const id of $selected) {
      playlist.removeSong(id);
    }

    $playlists = [ ...$playlists ];

    $showInfoSnackbar({ message: `${t("REMOVED_VALUE")} ${$selected.length} ${$selected.length === 1 ? t("SONG_SINGULAR_VALUE") : t("SONG_PLURAL_VALUE")}` });

    $selected = [];
    menuIsOpen = false;
  }

  let menuIsOpen = false;
</script>

<dialog open class="select-header" transition:fly={{ y: -50, duration: 250 }}>
  <div class="left">
    <Button type="text" iconType="full" on:click={back}>
      <Icon icon={BackArrow} width="36px" height="36px" />
    </Button>
  </div>
  <div class="title">
    {$selected.length} {t("SELECTED_VALUE")}
  </div>
  <div class="right">
    {#if $showQueue}
      <Button type="text" iconType="full" on:click={removeFromQueue}>
        <Icon icon={QueueRemove} width="36px" height="36px" />
      </Button>
    {:else}
      <Button type="text" iconType="full" on:click={addToQueue}>
        <Icon icon={QueueAdd} width="36px" height="36px" />
      </Button>
    {/if}
    {#if $location.startsWith("/playlists/")}
      <Button type="text" iconType="full" on:click={removeFromPlaylist}>
        <Icon icon={PlaylistRemove} width="36px" height="36px" />
      </Button>
    {/if}
    <Button type="text" iconType="full" on:click={addToPlaylist}>
      <Icon icon={PlaylistAdd} width="36px" height="36px" />
    </Button>
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      {#if !$showQueue}
        <MenuItem on:click={playNext}>{t("PLAY_NEXT_ACTION")}</MenuItem>
      {/if}
      <MenuItem on:click={goToBulkEdit}>{t("BULK_EDIT_ACTION")}</MenuItem>
      <MenuItem on:click={goToInfoParser}>{t("INFO_PARSER_ACTION")}</MenuItem>
      <MenuItem on:click={share}>{t("SHARE_ACTION")}</MenuItem>
      {#if $location !== "/artists" && !$showQueue}
        <MenuItem on:click={deleteFromDevice}>{t("DELETE_FROM_DEVICE_ACTION")}</MenuItem>
      {/if}
      {#if $selectedView !== View.SEARCH}
        <MenuItem on:click={selectAll}>{t("SELECT_ALL_ACTION")}</MenuItem>
      {/if}
    </MenuButton>
  </div>
</dialog>

<style>
  .select-header {
    border: 0;
    padding: 5px 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    color: rgb(var(--m3-scheme-on-background));
    background-color: rgb(var(--m3-scheme-surface-container-highest));

    position: absolute;
    top: 0;

    z-index: 3;
  }

  .select-header::backdrop {
    display: none;
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