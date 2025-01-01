import { AppController, PlaybackController } from "@controllers";
import type { ContextMenuItem } from "@directives";
import type { Song } from "@models";
import { showPopoutPlayer } from "@stores/Layout";
import { showAddToPlaylist, showCarMode, showMiniPlayer, showNowPlaying, showSleepTimerSelection, songToAdd } from "@stores/Overlays";
import { goToQueue, goToSongDetails, goToSongEdit } from "@utils";
import { push } from "svelte-spa-router";
import { get } from "svelte/store";

const addToPlaylist = (song: Song) => {
  songToAdd.set(song.id);
  showAddToPlaylist.set(true);
}

const goToQueuePage = () => {
  goToQueue();
  showMiniPlayer.set(true);
}

const goToCarMode = () => showCarMode.set(true);
const goToSleepTimer = () => showSleepTimerSelection.set(true);

const goToAlbum = (album: string) => {
  showMiniPlayer.set(true);
  push(`/albums/${album}`);
}

const goToArtist = (artist: string) => {
  showMiniPlayer.set(true);
  push(`/artists/${artist}`);
}

const showDetails = (song: Song) => {
  showMiniPlayer.set(true);
  goToSongDetails(song.id);
}

const showSongEdit = (song: Song) => {
  showMiniPlayer.set(true);
  goToSongEdit(song.id);
}

const share = (song: Song) => AppController.share([song.id]);


export function getNowPlayingMenuItems(song: Song | undefined, translate: (key: string) => string, showQueueOption: boolean, showSleepTimer: boolean, showCarMode: boolean): ContextMenuItem[] {
  const items: ContextMenuItem[] = [];

  if (showQueueOption) {
    items.push({
      id: "go-to-queue",
      text: translate("QUEUE_ACTION"),
      action: goToQueuePage,
    });
  }

  if (showCarMode) {
    items.push({
      id: "car-mode",
      text: translate("CAR_MODE_ACTION"),
      action: goToCarMode,
    });
  }

  if (showSleepTimer) {
    items.push({
      id: "sleep-timer",
      text: translate("SLEEP_TIMER_ACTION"),
      action: goToSleepTimer,
    });
  }

  if (song?.album) {
    items.push({
      id: "view-album",
      text: translate("GO_TO_ALBUM_ACTION"),
      action: () => goToAlbum(song.album!),
    });
  }
  
  if (song?.artist) {
    items.push({
      id: "view-artist",
      text: translate("GO_TO_ARTIST_ACTION"),
      action: () => goToArtist(song.artist!),
    });
  }
  

  items.push({
    id: "add-to-playlist",
    text: translate("ADD_TO_PLAYLIST_ACTION"),
    action: () => addToPlaylist(song!),
  });
  
  items.push({
    id: "view-details",
    text: translate("DETAILS_ACTION"),
    action: () => showDetails(song!),
  });
  
  items.push({
    id: "edit-song",
    text: translate("EDIT_ACTION"),
    action: () => showSongEdit(song!),
  });
  
  items.push({
    id: "share-song",
    text: translate("SHARE_ACTION"),
    action: () => share(song!),
  });

  return items;
}


const clearNowPlaying = () => {
  showNowPlaying.set(false)
  PlaybackController.resetNowPlaying();
}

export function getNowPlayingDesktopMenuItems(song: Song | undefined, translate: (key: string) => string, queueButtonIsHidden: boolean, popoutButtonIsHidden: boolean, popoutVisible: boolean) {
  const items: ContextMenuItem[] = [];

  items.push({
    id: "add-to-playlist",
    text: translate("ADD_TO_PLAYLIST_ACTION"),
    action: () => addToPlaylist(song!),
  });

  if (song?.album) {
    items.push({
      id: "view-album",
      text: translate("GO_TO_ALBUM_ACTION"),
      action: () => goToAlbum(song.album!),
    });
  }
  
  if (song?.artist) {
    items.push({
      id: "view-artist",
      text: translate("GO_TO_ARTIST_ACTION"),
      action: () => goToArtist(song.artist!),
    });
  }

  if (queueButtonIsHidden) {
    items.push({
      id: "go-to-queue",
      text: translate("QUEUE_ACTION"),
      action: goToQueue,
    });
  }

  items.push({
    id: "clear-queue",
    text: translate("CLEAR_QUEUE_ACTION"),
    action: clearNowPlaying,
  });

  if (popoutButtonIsHidden) {
    items.push({
      id: "toggle-popout",
      text: translate(popoutVisible ? "CLOSE_POPOUT_ACTION" : "OPEN_POPOUT_ACTION"),
      action: () => showPopoutPlayer.set(!get(showPopoutPlayer)),
    });
  }

  return items;
}