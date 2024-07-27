import { writable, type Writable } from "svelte/store";

export enum SidePanels {
  NONE,
  SONG_DETAILS,
  SONG_EDIT,
  SONG_BULK_EDIT,
  ALBUM_EDIT
}

export const desktopSidePanel: Writable<SidePanels> = writable(SidePanels.NONE);
export const sidePanelProps: Writable<any> = writable({});