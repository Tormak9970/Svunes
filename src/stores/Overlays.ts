import { writable } from "svelte/store";

export const showEditMusicFolders = writable(false);
export const showNowPlaying = writable(true); // ! will be false when tested.

export const showAddToPlaylist = writable(true); // ! will be false when tested.