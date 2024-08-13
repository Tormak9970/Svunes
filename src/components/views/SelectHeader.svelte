<script lang="ts" context="module">
  import { AppController, EditController, LogController, QueueController } from "@controllers";
  import { t } from "@stores/Locale";
  import { showAddToPlaylist, showQueue } from "@stores/Overlays";
  import { bulkEditSongIds, selected } from "@stores/Select";
  import { albums, albumsMap, artists, artistsMap, genresMap, playlists, playlistsMap, queue, selectedView, showInfoSnackbar, songIdsToParse, songs } from "@stores/State";
  import * as dialog from "@tauri-apps/plugin-dialog";
  import { View } from "@types";
  import { goToBulkEdit } from "@utils";
  import { location, push } from "svelte-spa-router";
  import { get } from "svelte/store";

  /**
   * Gets the ids of the songs from the selected items.
   * @param selectedItems The selected items.
   */
  function getSongsFromSelected(selectedItems: string[]): string[] {
    let songIds: string[] = [];

    let currentRoute = get(location);

    if (get(showQueue)) {
      songIds = selectedItems.map((merged) => merged.split("|")[0]);
      return songIds;
    }

    switch (get(selectedView)) {
      case View.PLAYLISTS: {
        if (currentRoute === "/playlists") {
          for (const id of selectedItems) {
            const playlist = get(playlistsMap)[id];
            songIds.push(...playlist.songIds);
          }
        } else {
          songIds = selectedItems;
        }
        break;
      }
      case View.ALBUMS: {
        if (currentRoute === "/albums") {
          for (const albumName of selectedItems) {
            const album = get(albumsMap)[albumName];
            songIds.push(...album.songIds);
          }
        } else {
          songIds = selectedItems;
        }
        break;
      }
      case View.ARTISTS: {
        if (currentRoute === "/artists") {
          for (const artistName of selectedItems) {
            const artist = get(artistsMap)[artistName];
            songIds.push(...artist.songIds);
          }
        } else {
          songIds = selectedItems;
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        songIds = selectedItems;
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
   * Export the selected playlists.
   */
  async function exportSelected() {
    const playlistIds = get(selected);
    const playlistMap = get(playlistsMap);

    for (const id of playlistIds) {
      const playlist = playlistMap[id];

      const path = await dialog.save({
        title: `${get(t)("EXPORT_ACTION")} ${playlist.name}`,
        defaultPath: `${playlist.id}.json`,
        filters: [
          {
            "name": get(t)("PLAYLIST_SINGULAR_VALUE"),
            "extensions": [ "json" ]
          }
        ]
      });

      if (path && path !== "") {
        AppController.exportPlaylist(path, playlist);
      }
    }
  }

  /**
   * Sets the selected items to be played next.
   */
  function playNext() {
    let currentRoute = get(location);

    const selectedItems = get(selected);
    
    switch (get(selectedView)) {
      case View.PLAYLISTS: {
        if (currentRoute === "/playlists") {
          QueueController.playPlaylistsNext(selectedItems);
        } else {
          QueueController.playSongsNext(selectedItems);
        }
        break;
      }
      case View.ALBUMS: {
        if (currentRoute === "/albums") {
          QueueController.playAlbumsNext(selectedItems);
        } else {
          QueueController.playSongsNext(selectedItems);
        }
        break;
      }
      case View.ARTISTS: {
        if (currentRoute === "/artists") {
          QueueController.playArtistsNext(selectedItems);
        } else {
          QueueController.playSongsNext(selectedItems);
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        QueueController.playSongsNext(selectedItems);
        break;
      }
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }

    selected.set([]);
  }

  /**
   * Prompts the user to share the selected songs.
   */
  function share() {
    const selectedItems = get(selected);
    AppController.share(getSongsFromSelected(selectedItems));
    
    selected.set([]);
  }

  /**
   * Prompts the user if they really want to delete everything they've selected.
   */
  function deleteFromDevice() {
    const selectedItems = get(selected);
    const playlistMap = get(playlistsMap);
    const currentRoute = get(location);

    switch (get(selectedView)) {
      case View.PLAYLISTS: {
        if (currentRoute === "/playlists") {
          const toDelete = selectedItems.filter((id) => playlistMap[id].isUserPlaylist);
          if (toDelete.length > 0) EditController.deletePlaylistsFromDevice(toDelete);
        } else {
          EditController.deleteSongsFromDevice(selectedItems);
        }
        break;
      }
      case View.ALBUMS: {
        if (currentRoute === "/albums") {
          EditController.deleteAlbumsFromDevice(selectedItems);
        } else {
          EditController.deleteSongsFromDevice(selectedItems);
        }
        break;
      }
      case View.ARTISTS: {
        if (currentRoute === "/artists") {
          LogController.error("Shouldn't be able to get here!");
        } else {
          EditController.deleteSongsFromDevice(selectedItems);
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        EditController.deleteSongsFromDevice(selectedItems);
        break;
      }
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
    
    selected.set([]);
  }

  /**
   * Selects everything.
   */
  function selectAll() {
    let selectedItems = get(selected);
    const currentRoute = get(location);

    if (get(showQueue)) {
      selectedItems = get(queue).map((songId, i) => songId + "|" + i);
      return;
    }

    switch (get(selectedView)) {
      case View.PLAYLISTS: {
        if (currentRoute === "/playlists") {
          selectedItems = get(playlists).map((playlist) => playlist.id);
        } else {
          const playlistId = currentRoute.substring(11);
          selectedItems = [ ...get(playlistsMap)[playlistId].songIds ];
        }
        break;
      }
      case View.ALBUMS: {
        if (currentRoute === "/albums") {
          selectedItems = get(albums).map((album) => album.name);
        } else {
          const albumName = currentRoute.substring(8).replaceAll("%20", " ");
          selectedItems = [ ...get(albumsMap)[albumName].songIds ];
        }
        break;
      }
      case View.SONGS: {
        selectedItems = get(songs).map((song) => song.id);
        break;
      }
      case View.ARTISTS: {
        if (currentRoute === "/artists") {
          selectedItems = get(artists).map((artist) => artist.name);
        } else {
          const artistName = currentRoute.substring(9).replaceAll("%20", " ");
          selectedItems = [ ...get(artistsMap)[artistName].songIds ];
        }
        break;
      }
      case View.GENRES: {
        const genreName = currentRoute.substring(8).replaceAll("%20", " ");
        selectedItems = [ ...get(genresMap)[genreName].songIds ];
        break;
      }
      case View.SEARCH:
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }

    selected.set(selectedItems);
  }

  /**
   * Queues the selected items.
   */
  function addToQueue() {
    const selectedItems = get(selected);
    const currentRoute = get(location);

    switch (get(selectedView)) {
      case View.PLAYLISTS: {
        if (currentRoute === "/playlists") {
          QueueController.queuePlaylists(selectedItems);
        } else {
          QueueController.queueSongs(selectedItems);
        }
        break;
      }
      case View.ALBUMS: {
        if (currentRoute === "/albums") {
          QueueController.queueAlbums(selectedItems);
        } else {
          QueueController.queueSongs(selectedItems);
        }
        break;
      }
      case View.ARTISTS: {
        if (currentRoute === "/artists") {
          QueueController.queueArtists(selectedItems);
        } else {
          QueueController.playSongsNext(selectedItems);
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        QueueController.queueSongs(selectedItems);
        break;
      }
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
    
    selected.set([]);
  }

  /**
   * Removes the selected items from the queue.
   */
  function removeFromQueue() {
    // * This is important because it accounts for if the elements were selected out of order.
    const selectedItems = get(selected).sort((a: string, b: string) => {
      const aIndex = parseInt(a.split("|")[1]);
      const bIndex = parseInt(b.split("|")[1]);

      return bIndex - aIndex;
    });

    const queueList = get(queue);

    for (const merged of selectedItems) {
      const [_, index] = merged.split("|");

      queueList.splice(parseInt(index), 1);
    }

    queue.set(queueList);
    selected.set([]);
  }

  /**
   * Shows the add to playlist overlay.
   */
  function addToPlaylist() {
    showAddToPlaylist.set(true);
  }

  /**
   * Shows the metadata parser.
   */
  function goToInfoParser() {
    const selectedItems = get(selected);
    songIdsToParse.set(getSongsFromSelected(selectedItems));
    push("/metadata-parser");
    
    selected.set([]);
  }

  /**
   * Shows the bulk edit page.
   */
  function bulkEdit() {
    const selectedItems = get(selected);
    bulkEditSongIds.set(getSongsFromSelected(selectedItems));
    goToBulkEdit();
    
    selected.set([]);
  }

  /**
   * Removes the selected songs from this playlist.
   * @param selectedItems The selected items.
   */
  function removeFromPlaylist(translate: (key: string) => string) {
    const selectedItems = get(selected);

    const playlistId = get(location).substring(11);
    const playlist = get(playlistsMap)[playlistId];
    
    for (const id of selectedItems) {
      playlist.removeSong(id);
    }

    playlists.set([ ...get(playlists) ]);

    get(showInfoSnackbar)({
      message: `${translate("REMOVED_VALUE")} ${selectedItems.length} ${selectedItems.length === 1 ? translate("SONG_SINGULAR_VALUE") : translate("SONG_PLURAL_VALUE")}`
    });

    selected.set([]);
  }

  export function getSelectContextMenuItems(translate: (key: string) => string): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];
    const currentRoute = get(location);
    const isQueuePage = get(showQueue);

    if (isQueuePage) {
      items.push({
        id: "dequeue",
        text: translate("REMOVE_FROM_QUEUE_ACTION"),
        action: removeFromQueue,
      });
    } else {
      items.push({
        id: "play-next",
        text: translate("PLAY_NEXT_ACTION"),
        action: playNext,
      });
      items.push({
        id: "queue",
        text: translate("ADD_TO_QUEUE_ACTION"),
        action: removeFromQueue,
      });
    }

    if (currentRoute.startsWith("/playlists/")) {
      items.push({
        id: "remove-from-playlist",
        text: translate("REMOVE_FROM_PLAYLIST_ACTION"),
        action: () => removeFromPlaylist(translate),
      });
    }
    
    items.push({
      id: "add-to-playlist",
      text: translate("ADD_TO_PLAYLISTS_ACTION"),
      action: addToPlaylist,
    });

    if (currentRoute === "/playlists") {
      items.push({
        id: "export",
        text: translate("EXPORT_ACTION"),
        action: exportSelected,
      });
    }

    items.push({
      isSeparator: true,
    });

    if (currentRoute !== "/artists") {
      items.push({
        id: "bulk-edit",
        text: translate("BULK_EDIT_ACTION"),
        action: bulkEdit,
      });
      items.push({
        id: "info-parser",
        text: translate("INFO_PARSER_ACTION"),
        action: goToInfoParser,
      });
    }
    
    if (currentRoute !== "/artists" && !isQueuePage) {
      items.push({
        id: "delete",
        text: translate("DELETE_FROM_DEVICE_ACTION"),
        action: deleteFromDevice,
      });
    }

    if (currentRoute !== "/artists" && currentRoute !== "/albums" && currentRoute !== "/playlists") {
      items.push({
        id: "share",
        text: translate("SHARE_ACTION"),
        action: share,
      });
    }

    if (get(selectedView) !== View.SEARCH) {
      items.push({
        id: "select-all",
        text: translate("SELECT_ALL_ACTION"),
        action: selectAll,
      });
    }

    return items;
  }
</script>

<script lang="ts">
  import { Icon } from "@component-utils";
  import type { ContextMenuItem } from "@directives";
  import { AddToQueue, BackArrow, MoreVert, PlaylistAdd, PlaylistRemove, RemoveFromQueue } from "@icons";
  import { Button, MenuButton } from "@interactables";
  import { MenuItem } from "@layout";
  import { fly } from "svelte/transition";
  
  let menuIsOpen = false;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }

</script>

<dialog open class="select-header" transition:fly={{ y: -50, duration: 250 }}>
  <div class="left">
    <Button type="text" iconType="full" on:click={() => { $selected = []; closeOptions(); }}>
      <Icon icon={BackArrow} width="36px" height="36px" />
    </Button>
  </div>
  <div class="title">
    {$selected.length} {$t("SELECTED_VALUE")}
  </div>
  <div class="right">
    {#if $showQueue}
      <Button type="text" iconType="full" on:click={() => { removeFromQueue(); closeOptions(); }}>
        <Icon icon={RemoveFromQueue} width="36px" height="36px" />
      </Button>
    {:else}
      <Button type="text" iconType="full" on:click={() => { addToQueue(); closeOptions(); }}>
        <Icon icon={AddToQueue} width="36px" height="36px" />
      </Button>
    {/if}
    {#if $location.startsWith("/playlists/")}
      <Button type="text" iconType="full" on:click={() => { removeFromPlaylist($t); closeOptions(); }}>
        <Icon icon={PlaylistRemove} width="36px" height="36px" />
      </Button>
    {/if}
    <Button type="text" iconType="full" on:click={() => { addToPlaylist(); closeOptions(); }}>
      <Icon icon={PlaylistAdd} width="36px" height="36px" />
    </Button>
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      {#if !$showQueue}
        <MenuItem on:click={() => { playNext(); closeOptions(); }}>
          {$t("PLAY_NEXT_ACTION")}
        </MenuItem>
      {/if}
      {#if $location === "/playlists"}
        <MenuItem on:click={() => { exportSelected(); closeOptions(); }}>
          {$t("EXPORT_ACTION")}
        </MenuItem>
      {/if}
      <MenuItem on:click={() => { bulkEdit(); closeOptions(); }}>
        {$t("BULK_EDIT_ACTION")}
      </MenuItem>
      <MenuItem on:click={() => { goToInfoParser(); closeOptions(); }}>
        {$t("INFO_PARSER_ACTION")}
      </MenuItem>
      <MenuItem on:click={() => { share(); closeOptions(); }}>
        {$t("SHARE_ACTION")}
      </MenuItem>
      {#if $location !== "/artists" && !$showQueue}
        <MenuItem on:click={() => { deleteFromDevice(); closeOptions(); }}>
          {$t("DELETE_FROM_DEVICE_ACTION")}
        </MenuItem>
      {/if}
      {#if $selectedView !== View.SEARCH}
        <MenuItem on:click={() => { selectAll(); closeOptions(); }}>
          {$t("SELECT_ALL_ACTION")}
        </MenuItem>
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