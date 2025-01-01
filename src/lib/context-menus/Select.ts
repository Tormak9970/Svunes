import { AppController, EditController, LogController, QueueController } from "@controllers";
import type { ContextMenuItem } from "@directives";
import { t } from "@stores/Locale";
import { showAddToPlaylist, showQueue } from "@stores/Overlays";
import { bulkEditSongIds, selected } from "@stores/Select";
import { albums, albumsMap, artists, artistsMap, genresMap, playlists, playlistsMap, queue, selectedView, showInfoSnackbar, songIdsToParse, songs } from "@stores/State";
import * as dialog from "@tauri-apps/plugin-dialog";
import { View } from "@types";
import { goToBulkEdit } from "@utils";
import { push } from "svelte-spa-router";
import { get } from "svelte/store";

export function getSongsFromSelected(selectedItems: string[], currentRoute: string): string[] {
  let songIds: string[] = [];

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

async function exportSelected(playlistIds: string[]) {
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

function playNext(selectedItems: string[], currentRoute: string) {
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

function share(selectedItems: string[], currentRoute: string) {
  AppController.share(getSongsFromSelected(selectedItems, currentRoute));
  
  selected.set([]);
}

function deleteFromDevice(selectedItems: string[], currentRoute: string) {
  const playlistMap = get(playlistsMap);

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

function selectAll(selectedItems: string[], currentRoute: string) {
  let items = selectedItems;

  if (get(showQueue)) {
    selectedItems = get(queue).map((songId, i) => songId + "|" + i);
    return;
  }

  switch (get(selectedView)) {
    case View.PLAYLISTS: {
      if (currentRoute === "/playlists") {
        items = get(playlists).map((playlist) => playlist.id);
      } else {
        const playlistId = currentRoute.substring(11);
        items = [ ...get(playlistsMap)[playlistId].songIds ];
      }
      break;
    }
    case View.ALBUMS: {
      if (currentRoute === "/albums") {
        items = get(albums).map((album) => album.name);
      } else {
        const albumName = currentRoute.substring(8).replaceAll("%20", " ");
        items = [ ...get(albumsMap)[albumName].songIds ];
      }
      break;
    }
    case View.SONGS: {
      items = get(songs).map((song) => song.id);
      break;
    }
    case View.ARTISTS: {
      if (currentRoute === "/artists") {
        items = get(artists).map((artist) => artist.name);
      } else {
        const artistName = currentRoute.substring(9).replaceAll("%20", " ");
        items = [ ...get(artistsMap)[artistName].songIds ];
      }
      break;
    }
    case View.GENRES: {
      const genreName = currentRoute.substring(8).replaceAll("%20", " ");
      items = [ ...get(genresMap)[genreName].songIds ];
      break;
    }
    case View.SEARCH:
    case View.HOME:
    case View.SETTINGS: {
      LogController.error("Shouldn't be able to get here!");
      break;
    }
  }

  selected.set(items);
}

function addToQueue(selectedItems: string[], currentRoute: string) {
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

function removeFromQueue(selectedItems: string[]) {
  // * This is important because it accounts for if the elements were selected out of order.
  const items = selectedItems.sort((a: string, b: string) => {
    const aIndex = parseInt(a.split("|")[1]);
    const bIndex = parseInt(b.split("|")[1]);

    return bIndex - aIndex;
  });

  const queueList = get(queue);

  for (const merged of items) {
    const [_, index] = merged.split("|");

    queueList.splice(parseInt(index), 1);
  }

  queue.set(queueList);
  selected.set([]);
}

function addToPlaylist() {
  showAddToPlaylist.set(true);
}

function goToInfoParser(selectedItems: string[], currentRoute: string) {
  songIdsToParse.set(getSongsFromSelected(selectedItems, currentRoute));
  push("/metadata-parser");
  
  selected.set([]);
}

function bulkEdit(selectedItems: string[], currentRoute: string) {
  bulkEditSongIds.set(getSongsFromSelected(selectedItems, currentRoute));
  goToBulkEdit();
  
  selected.set([]);
}

/**
 * Removes the selected songs from this playlist.
 * @param selectedItems The selected items.
 */
function removeFromPlaylist(selectedItems: string[], currentRoute: string, t: (key: string) => string) {
  const playlistId = currentRoute.substring(11);
  const playlist = get(playlistsMap)[playlistId];
  
  for (const id of selectedItems) {
    playlist.removeSong(id);
  }

  playlists.set([ ...get(playlists) ]);

  get(showInfoSnackbar)({
    message: `${t("REMOVED_VALUE")} ${selectedItems.length} ${selectedItems.length === 1 ? t("SONG_SINGULAR_VALUE") : t("SONG_PLURAL_VALUE")}`
  });

  selected.set([]);
}

export function getSelectContextMenuItems(selectedItems: string[], translate: (key: string) => string, currentRoute: string): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];
  const isQueuePage = get(showQueue);

  if (isQueuePage) {
    items.push({
      id: "dequeue",
      text: translate("REMOVE_FROM_QUEUE_ACTION"),
      action: () => removeFromQueue(selectedItems),
    });
  } else {
    items.push({
      id: "play-next",
      text: translate("PLAY_NEXT_ACTION"),
      action: () => playNext(selectedItems, currentRoute),
    });
    items.push({
      id: "queue",
      text: translate("ADD_TO_QUEUE_ACTION"),
      action: () => addToQueue(selectedItems, currentRoute),
    });
  }

  if (currentRoute.startsWith("/playlists/")) {
    items.push({
      id: "remove-from-playlist",
      text: translate("REMOVE_FROM_PLAYLIST_ACTION"),
      action: () => removeFromPlaylist(selectedItems, currentRoute, translate),
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
      action: () => exportSelected(selectedItems),
    });
  }

  items.push({
    isSeparator: true,
  });

  if (currentRoute !== "/artists") {
    items.push({
      id: "bulk-edit",
      text: translate("BULK_EDIT_ACTION"),
      action: () => bulkEdit(selectedItems, currentRoute),
    });
    items.push({
      id: "info-parser",
      text: translate("INFO_PARSER_ACTION"),
      action: () => goToInfoParser(selectedItems, currentRoute),
    });
  }
  
  if (currentRoute !== "/artists" && !isQueuePage) {
    items.push({
      id: "delete",
      text: translate("DELETE_FROM_DEVICE_ACTION"),
      action: () => deleteFromDevice(selectedItems, currentRoute),
    });
  }

  if (currentRoute !== "/artists" && currentRoute !== "/albums" && currentRoute !== "/playlists") {
    items.push({
      id: "share",
      text: translate("SHARE_ACTION"),
      action: () => share(selectedItems, currentRoute),
    });
  }

  if (get(selectedView) !== View.SEARCH) {
    items.push({
      id: "select-all",
      text: translate("SELECT_ALL_ACTION"),
      action: () => selectAll(selectedItems, currentRoute),
    });
  }

  return items;
}