import { AppController, EditController, QueueController } from "@controllers";
import type { ContextMenuItem } from "@directives";
import type { Song } from "@models";
import { showAddToPlaylist, songToAdd } from "@stores/Overlays";
import { playlists, playlistsMap, songIdsToParse } from "@stores/State";
import { goToSongDetails, goToSongEdit } from "@utils";
import { location, push, replace } from "svelte-spa-router";
import { get } from "svelte/store";

const removeFromPlaylist = (songId: string) => {
  const id = get(location).slice(11);
  const playlist = get(playlistsMap)[id];

  playlist.removeSong(songId);
  
  playlists.set([ ...get(playlists) ]);
}

const playNext = (songId: string) => QueueController.playSongsNext([songId]);
const queueSong = (songId: string) => QueueController.queueSongs([songId]);

const addToPlaylist = (songId: string) => {
  songToAdd.set(songId);
  showAddToPlaylist.set(true);
}

const goToAlbum = (album?: string) => push(`/albums/${album!}`);
const goToArtist = (artist?: string) => push(`/artists/${artist!}`);
const showDetails = (songId: string) => goToSongDetails(songId);
const showSongEdit = (songId: string) => goToSongEdit(songId);
const share = (songId: string) => AppController.share([songId]);

const showInfoParser = (songId: string) => {
  songIdsToParse.set([ songId ]);
  push("/metadata-parser");
}

const deleteSong = (songId: string) => {
  EditController.deleteSongsFromDevice([songId]);
  if (get(location).startsWith("/songs/")) replace("/songs");
}

export function getSongMenuItems(song: Song, translate: (key: string) => string, currentRoute: string, hideEditOption?: boolean): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  if (currentRoute.startsWith("/playlists")) {
    items.push({
      id: "remove-from-playlist",
      text: translate("REMOVE_FROM_PLAYLIST_ACTION"),
      action: () => removeFromPlaylist(song.id),
    });
  }

  items.push({
    id: "play-next",
    text: translate("PLAY_NEXT_ACTION"),
    action: () => playNext(song.id),
  });
  items.push({
    id: "queue",
    text: translate("ADD_TO_QUEUE_ACTION"),
    action: () => queueSong(song.id),
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

  if (!hideEditOption) {
    items.push({
      id: "edit-song",
      text: translate("EDIT_ACTION"),
      action: () => showSongEdit(song.id),
    });
  }

  items.push({
    id: "parse-info",
    text: translate("INFO_PARSER_ACTION"),
    action: () => showInfoParser(song.id),
  });
  items.push({
    id: "delete-song",
    text: translate("DELETE_ACTION"),
    action: () => deleteSong(song.id),
  });
  items.push({
    id: "share-song",
    text: translate("SHARE_ACTION"),
    action: () => share(song.id),
  });

  return items;
}