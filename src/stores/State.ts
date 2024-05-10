import { writable, type Writable } from "svelte/store";
import { View } from "../types/View";
import { GridSize, GridStyle, NowPlayingAlbumTheme, NowPlayingLayout, type AlbumSortOrder, type ArtistSortOrder, type PlaylistSortOrder, type SongSortOrder } from "../types/Settings";
import type { Playlist } from "../lib/models/Playlist";
import type { Song } from "../lib/models/Song";
import type { Album } from "../lib/models/Album";
import type { Artist } from "../lib/models/Artist";

export const hasLoaded = writable(false);

// * View stores
export const showViewNav = writable(true);
export const musicDirectories: Writable<string[]> = writable([]);
export const selectedView: Writable<View> = writable(0);

export const showMiniPlayer = writable(true);

export const playlists: Writable<Playlist[]> = writable([]);
export const queue: Writable<Song[]> = writable([]);

// * Settings stores
export const themePrimaryColor = writable("#7bdd69");

// # Now Playing Settings
export const songProgress = writable(0);
export const showSongInfo = writable(false);
export const circularPlayButton = writable(false);
export const nowPlayingLayout = writable(NowPlayingLayout.NORMAL);
export const nowPlayingAlbumTheme = writable(NowPlayingAlbumTheme.NORMAL);

export const dismissMiniPlayerWithSwipe = writable(true);
export const showExtraControls = writable(true);
export const showVolumeControls = writable(false);

// # Audio Settings
export const fadeAudioOnPause = writable(false);
export const autoPlayOnConnect = writable(false);
export const autoPlayOnBluetooth = writable(false);

// # Personalization Settings
export const viewsToRender: Writable<View[]> = writable([ View.PLAYLISTS, View.ALBUMS, View.SONGS, View.GENRES, View.SETTINGS])
export const showSuggestions = writable(true);
export const trackHistory = writable(true);
export const showAlbumOnLockScreen = writable(true);

// # Cache Settings
export const albums: Writable<Album[]> = writable([]);
export const songs: Writable<Song[]> = writable([]);
export const artists: Writable<Artist[]> = writable([]);

// # View Settings
export const playlistGridSize: Writable<GridSize> = writable(GridSize.TWO);
export const playlistSortOrder: Writable<PlaylistSortOrder> = writable("Alphabetical");

export const albumGridSize: Writable<GridSize> = writable(GridSize.TWO);
export const albumSortOrder: Writable<AlbumSortOrder> = writable("Alphabetical");

export const songGridSize: Writable<GridSize> = writable(GridSize.LIST);
export const songSortOrder: Writable<SongSortOrder> = writable("Alphabetical");

export const artistGridSize: Writable<GridSize> = writable(GridSize.TWO);
export const artistGridStyle: Writable<GridStyle> = writable(GridStyle.CIRCULAR);
export const artistSortOrder: Writable<ArtistSortOrder> = writable("Alphabetical");