import { writable, type Writable } from "svelte/store";

export const showMiniPlayer = writable(false);
export const showNowPlaying = writable(false);
export const showCarMode = writable(false);
export const showQueue = writable(false);

export const showCreatePlaylist = writable(false);
export const songsForNewPlaylist: Writable<string[]> = writable([]);

export const showAddToPlaylist = writable(false);
export const songToAdd = writable<string | null>(null);
export const playlistToAdd = writable<string | null>(null);
export const albumToAdd = writable<string | null>(null);
export const artistToAdd = writable<string | null>(null);
export const genreToAdd = writable<string | null>(null);

export const showWritingChanges = writable(false);

export const showSleepTimerSelection = writable(false);