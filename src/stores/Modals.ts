import { writable, type Writable } from "svelte/store";

export const showEditMusicFolders = writable(false);

export const showSongGridSize = writable(false);
export const showSongSortOrder = writable(false);


export const showArtOptions = writable(false);
export const onArtOptionsDone: Writable<(artPath: string | undefined) => void> = writable(() => {});