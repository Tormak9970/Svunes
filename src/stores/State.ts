import { derived, writable, type Readable, type Writable } from "svelte/store";
import { View } from "../types/View";
import { AppLanguage, GridSize, GridStyle, NowPlayingBackgroundType, NowPlayingTheme, type AlbumSortOrder, type ArtistSortOrder, type NowPlayingType, type Palette, type PlaylistSortOrder, type SongSortOrder } from "../types/Settings";
import type { Playlist } from "../lib/models/Playlist";
import type { Song } from "../lib/models/Song";
import type { Album } from "../lib/models/Album";
import type { Artist } from "../lib/models/Artist";
import type { Genre } from "../lib/models/Genre";
import { location } from "svelte-spa-router";

export const isLoading = writable(true);
export const shuffle = writable(true);
export const isPaused = writable(true);

export const showInfoSnackbar: Writable<(data: ShowInfoOptions) => void> = writable(() => {});
export const showErrorSnackbar: Writable<(data: ShowErrorOptions) => void> = writable(() => {});

// * View stores
export const musicDirectories: Writable<string[]> = writable([]);
export const selectedView: Writable<View> = writable(-1 as View);
export const showViewNav: Readable<boolean> = derived(location, (loc) => loc.lastIndexOf("/") === 0 && loc !== "/settings" && loc !== "/search");

export const playlistsIsAtTop = writable(true);
export const songsIsAtTop = writable(true);
export const albumsIsAtTop = writable(true);
export const artistsIsAtTop = writable(true);

export const playlists: Writable<Playlist[]> = writable([]);
export const playlistsMap: Readable<Record<string, Playlist>> = derived(playlists, (playlists: Playlist[]) => {
  const entries: [string, Playlist][] = playlists.map((playlist) => [playlist.id, playlist]);
  return Object.fromEntries(entries);
});

export const history: Writable<string[]> = writable([]);
export const queue: Writable<string[]> = writable([]);

export const blacklistedFolders: Writable<string[]> = writable([]);
export const pauseOnVolumeZero = writable(false);
export const filterSongDuration = writable(30);
export const selectedLanguage = writable(AppLanguage.SYSTEM);

export const artists: Writable<Artist[]> = writable([]);
export const artistsMap: Readable<Record<string, Artist>> = derived(artists, (artists: Artist[]) => {
  const entries: [string, Artist][] = artists.map((artist) => [artist.name, artist]);
  return Object.fromEntries(entries);
});
export const genres: Writable<Genre[]> = writable([]);
export const genresMap: Readable<Record<string, Genre>> = derived(genres, (genres: Genre[]) => {
  const entries: [string, Genre][] = genres.map((genre) => [genre.name, genre]);
  return Object.fromEntries(entries);
});

export const lastView: Writable<View | null> = writable(null);
export const isSwitchingView = writable(false);

// * Settings stores
export const palette = writable<Palette>("Auto");
export const useOledPalette = writable(false);
export const themePrimaryColor = writable("");

// # Now Playing Settings
export const showExtraSongInfo = writable(false);
export const circularPlayButton = writable(true);
export const nowPlayingTheme = writable(NowPlayingTheme.NORMAL);

export const dismissMiniPlayerWithSwipe = writable(true);
export const showExtraControls = writable(true);
export const showVolumeControls = writable(true);

export const nowPlayingUseAlbumColors = writable(true);
export const nowPlayingBackgroundType = writable(NowPlayingBackgroundType.GRADIENT);

// # Audio Settings
export const fadeAudioOnPause = writable(false);
export const autoPlayOnConnect = writable(false);
export const autoPlayOnBluetooth = writable(false);

// # Personalization Settings
export const viewsToRender: Writable<View[]> = writable([]);
export const viewIndices: Writable<Record<View, number>> = writable({
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7
});
export const showSuggestions = writable(true);
export const trackHistory = writable(true);
export const showAlbumOnLockScreen = writable(true);

// # Cache Settings
export const albums: Writable<Album[]> = writable([]);
export const albumsMap: Readable<Record<string, Album>> = derived(albums, (albums: Album[]) => {
  const entries: [string, Album][] = albums.map((album) => [album.name, album]);
  return Object.fromEntries(entries);
});
export const songs: Writable<Song[]> = writable([]);
export const songsMap: Readable<Record<string, Song>> = derived(songs, (songs: Song[]) => {
  const entries: [string, Song][] = songs.map((song) => [song.id, song]);
  return Object.fromEntries(entries);
});
export const songProgress = writable(0);
export const playingSongId: Writable<string> = writable("");
export const nowPlayingList: Writable<string> = writable("");
export const nowPlayingType: Writable<NowPlayingType> = writable("Song");

// # View Settings
export const playlistGridSize: Writable<GridSize> = writable(GridSize.LARGE);
export const playlistSortOrder: Writable<PlaylistSortOrder> = writable("Alphabetical");

export const albumGridSize: Writable<GridSize> = writable(GridSize.LARGE);
export const albumSortOrder: Writable<AlbumSortOrder> = writable("Alphabetical");
export const useAlbumColors: Writable<boolean> = writable(true);

export const songGridSize: Writable<GridSize> = writable(GridSize.LIST);
export const songSortOrder: Writable<SongSortOrder> = writable("Alphabetical");

export const artistGridSize: Writable<GridSize> = writable(GridSize.LARGE);
export const artistGridStyle: Writable<GridStyle> = writable(GridStyle.CIRCULAR);
export const artistSortOrder: Writable<ArtistSortOrder> = writable("Alphabetical");
export const useArtistColors: Writable<boolean> = writable(true);