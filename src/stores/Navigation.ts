import { writable, type Writable } from "svelte/store";

export type FromType = "Songs" | "Song Details" | "Albums" | "Artists" | "Playlists" | "Search" | "View";

export const songDetailsFrom: Writable<FromType> = writable("View");
export const artistFrom: Writable<FromType> = writable("View");
export const albumFrom: Writable<FromType> = writable("View");
export const genreFrom: Writable<FromType> = writable("View");

export const playlistViewing: Writable<string | null> = writable(null);
export const songViewing: Writable<string | null> = writable(null);
export const albumViewing: Writable<string | null> = writable(null);
export const artistViewing: Writable<string | null> = writable(null);
export const genreViewing: Writable<string | null> = writable(null);

export const editing = writable(false);