import { writable, type Writable } from "svelte/store";

export enum SidePanels {
  NONE,
  SONG_DETAILS,
  SONG_EDIT,
  SONG_BULK_EDIT,
  ALBUM_EDIT,
  PLAYLIST_EDIT
}

export const isLandscape: Writable<boolean> = writable(!IS_MOBILE);
export const desktopSidePanel: Writable<SidePanels> = writable(SidePanels.NONE);
export const sidePanelProps: Writable<any> = writable({});