import { writable, type Writable } from "svelte/store";

export const showNowPlaying = writable(true); // ! will be false after tested.

export const showSongDetails = writable(false);
export const songViewing: Writable<string | null> = writable(null);
export const showEditSong = writable(false);

export const showAlbumDetails = writable(false);
export const albumViewing: Writable<string | null> = writable(null);
export const showEditAlbum = writable(false);

export const showAddToPlaylist = writable(false);
export const songToAdd: Writable<string | null> = writable(null);
export const albumToAdd: Writable<string | null> = writable(null);
export const artistToAdd: Writable<string | null> = writable(null);

export const showPlaylistDetails = writable(false);
export const playlistViewing: Writable<string | null> = writable(null);

export const showArtistDetails = writable(false);
export const artistViewing: Writable<string | null> = writable(null);

export const showGenreDetails = writable(false);
export const genreViewing: Writable<string | null> = writable(null);

export const showSongOptions = writable(false);
export const songToShowOptions: Writable<string | null> = writable(null);