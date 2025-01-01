import { AppController } from "@controllers";
import type { ContextMenuItem } from "@directives";
import type { Song } from "@models";
import { showAddToPlaylist, showQueue, songToAdd } from "@stores/Overlays";
import { queue } from "@stores/State";
import { goToSongDetails, goToSongEdit } from "@utils";
import { push } from "svelte-spa-router";
import { get } from "svelte/store";

const removeFromQueue = (index: number) => {
  const queueList = get(queue);
  queueList.splice(index, 1);

  queue.set([ ...queueList ]);
}

const addToPlaylist = (songId: string) => {
  songToAdd.set(songId);
  showAddToPlaylist.set(true);
}

const goToAlbum = (album?: string) => {
  push(`/albums/${album!}`);
  showQueue.set(false);
}
const goToArtist = (artist?: string) => {
  push(`/artists/${artist!}`);
  showQueue.set(false);
}
const showDetails = (songId: string) => {
  goToSongDetails(songId);
  showQueue.set(false);
}
const showSongEdit = (songId: string) => {
  goToSongEdit(songId);
  showQueue.set(false);
}
const share = (songId: string) => AppController.share([songId]);

export function getQueueSongMenuItems(song: Song, index: number, translate: (key: string) => string): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  items.push({
    id: "dequeue",
    text: translate("REMOVE_FROM_QUEUE_ACTION"),
    action: () => removeFromQueue(index),
  });
  items.push({
    id: "add-to-playlist",
    text: translate("ADD_TO_PLAYLISTS_ACTION"),
    action: () => addToPlaylist(song.id),
  });
  
  items.push({
    isSeparator: true,
  });

  items.push({
    id: "view-details",
    text: translate("DETAILS_ACTION"),
    action: () => showDetails(song.id),
  });

  if (song.album) {
    items.push({
      id: "view-album",
      text: translate("GO_TO_ALBUM_ACTION"),
      action: () => goToAlbum(song.album),
    });
  }

  if (song.artist) {
    items.push({
      id: "view-artist",
      text: translate("GO_TO_ARTIST_ACTION"),
      action: () => goToArtist(song.artist),
    });
  }
  
  items.push({
    isSeparator: true,
  });

  items.push({
    id: "edit-song",
    text: translate("EDIT_ACTION"),
    action: () => showSongEdit(song.id),
  });

  items.push({
    id: "share-song",
    text: translate("SHARE_ACTION"),
    action: () => share(song.id),
  });

  return items;
}