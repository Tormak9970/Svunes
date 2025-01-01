import { AppController, EditController, PlaybackController, QueueController } from "@controllers";
import type { ContextMenuItem } from "@directives";
import type { Playlist } from "@models";
import { playlistToAdd, showAddToPlaylist } from "@stores/Overlays";
import { playlists } from "@stores/State";
import * as dialog from "@tauri-apps/plugin-dialog";
import { goToPlaylistEdit } from "@utils";
import { location, replace } from "svelte-spa-router";
import { get } from "svelte/store";

const playPlaylist = (playlist: Playlist) => PlaybackController.playPlaylist(playlist);
const playNext = (playlistId: string) => QueueController.playPlaylistsNext([playlistId]);
const queuePlaylist = (playlistId: string) => QueueController.queuePlaylists([playlistId]);

const addToPlaylist = (playlistId: string) => {
  playlistToAdd.set(playlistId);
  showAddToPlaylist.set(true);
}

const togglePinned = (playlist: Playlist) => {
  playlist.pinned = !playlist.pinned;
  playlists.set([ ...get(playlists) ]);
}

const showPlaylistEdit = (playlistId: string) => goToPlaylistEdit(playlistId);

const deletePlaylist = (playlistId: string) => {
  EditController.deletePlaylistsFromDevice([playlistId]);
  if (get(location).startsWith("/playlists/")) replace("/playlists");
}

async function exportPlaylist(playlist: Playlist, t: (key: string) => string) {
  const path = await dialog.save({
    title: `${t("EXPORT_ACTION")} ${playlist.name}`,
    defaultPath: `${playlist.id}.json`,
    filters: [
      {
        "name": t("PLAYLIST_SINGULAR_VALUE"),
        "extensions": [ "json" ]
      }
    ]
  });

  if (path && path !== "") {
    AppController.exportPlaylist(path, playlist);
  }
}

export function getPlaylistMenuItems(playlist: Playlist, translate: (key: string) => string, isPinned: boolean): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  items.push({
    id: "play-playlist",
    text: translate("PLAY_ACTION"),
    action: () => playPlaylist(playlist),
  });
  items.push({
    id: "play-next",
    text: translate("PLAY_NEXT_ACTION"),
    action: () => playNext(playlist.id),
  });
  items.push({
    id: "queue",
    text: translate("ADD_TO_QUEUE_ACTION"),
    action: () => queuePlaylist(playlist.id),
  });
  items.push({
    id: "add-to-playlist",
    text: translate("ADD_TO_PLAYLISTS_ACTION"),
    action: () => addToPlaylist(playlist.id),
  });
  
  items.push({
    isSeparator: true,
  });

  items.push({
    id: "toggle-pinned",
    text: translate(isPinned ? "UNPIN_ACTION" : "PIN_ACTION"),
    action: () => togglePinned(playlist),
  });
  
  items.push({
    isSeparator: true,
  });

  items.push({
    id: "edit-playlist",
    text: translate("EDIT_ACTION"),
    action: () => showPlaylistEdit(playlist.id),
  });

  items.push({
    id: "delete-playlist",
    text: translate("DELETE_ACTION"),
    action: () => deletePlaylist(playlist.id),
  });

  items.push({
    id: "export-playlist",
    text: translate("EXPORT_ACTION"),
    action: () => exportPlaylist(playlist, translate),
  });

  return items;
}