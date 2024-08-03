import { writable, type Writable } from "svelte/store";

export type SearchChip = "song" | "album" | "artist" | "playlist" | "genre";

export const searchQuery = writable("");
export const selectedChips: Writable<SearchChip[]> = writable([]);

// * advanced filters
export const showOnlyMissingTitle = writable(false);
export const showOnlyMissingCover = writable(false);
export const showOnlyMissingArtist = writable(false);
export const showOnlyMissingAlbumArtist = writable(false);
export const showOnlyMissingAlbum = writable(false);
export const showOnlyMissingGenre = writable(false);
export const showOnlyMissingYear = writable(false);