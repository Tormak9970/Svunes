import { writable, type Writable } from "svelte/store";

export const showNowPlaying = writable(true); // ! will be false after tested.

export const showCreatePlaylist = writable(false);

export const showAddToPlaylist = writable(false);
export const songToAdd: Writable<string | null> = writable(null);
export const playlistToAdd: Writable<string | null> = writable(null);
export const albumToAdd: Writable<string | null> = writable(null);
export const artistToAdd: Writable<string | null> = writable(null);
export const genreToAdd: Writable<string | null> = writable(null);