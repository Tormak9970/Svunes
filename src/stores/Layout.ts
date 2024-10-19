import { writable } from "svelte/store";

export enum SidePanels {
  NONE,
  SONG_DETAILS,
  SONG_EDIT,
  SONG_BULK_EDIT,
  ALBUM_EDIT,
  PLAYLIST_EDIT
}

export const isLandscape = writable<boolean>(!IS_MOBILE);
export const desktopSidePanel = writable(SidePanels.NONE);
export const sidePanelProps = writable<any>({});