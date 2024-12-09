import { type Album, type Artist, type Genre, type Playlist, type Song } from "@models";
import { invoke } from "@tauri-apps/api/core";
import { GridSize, GridStyle, NowPlayingBackgroundType, NowPlayingTheme, View, type AlbumSortOrder, type ArtistSortOrder, type Equalizer, type NowPlayingExtraControl, type NowPlayingType, type Palette, type PlaylistSortOrder, type SongSortOrder } from "@types";
import { location } from "svelte-spa-router";
import { derived, writable } from "svelte/store";
import { showMiniPlayer, showNowPlaying, showQueue } from "./Overlays";

export const profiles = writable<string[]>(["Default"]);
export const currentProfile = writable("Default");
export const isLoading = writable(true);
export const shuffle = writable(true);
export const repeatPlayed = writable(false);
export const volumeLevel = writable(1);
export const isPaused = writable(true);
export const shouldPauseOnEnd = writable(false);

export const connectedDevices = writable<string[]>([]);
export const selectedDevice = writable("");

export const audioBalance = writable<number>(0);
export const equalizers = writable<Record<string, Equalizer>>({});
export const currentEq = writable("Default");
/**
 * Represents the active equalizer. Updates when either the `equalizers` or `currentEq` store changes.
 */
export const activeEq = derived([equalizers, currentEq], ([$equalizers, $currentEq]) => $equalizers[$currentEq]);

export const songIdsToParse = writable<string[]>([]);

export const showInfoSnackbar = writable<(data: ShowInfoOptions) => void>();
export const showErrorSnackbar = writable<(data: ShowErrorOptions) => void>();

// * View stores
export const musicDirectories = writable<string[]>([]);
export const selectedView = writable<View>(-1 as View);
export const showNav = derived([location, showQueue, showNowPlaying, showMiniPlayer], ([$location, $showQueue, $showNowPlaying, $showMiniPlayer]) => {
  return $location.lastIndexOf("/") === 0 && $location !== "/settings" && $location !== "/search" && $location !== "/metadata-parser" &&
    !$showQueue &&
    !($showNowPlaying && !$showMiniPlayer);
});

export const playlistsIsScrolled = writable(false);
export const songsIsScrolled = writable(false);
export const albumsIsScrolled = writable(false);
export const artistsIsScrolled = writable(false);

export const playlists = writable<Playlist[]>([]);
export const playlistsMap = derived(playlists, (playlists: Playlist[]) => {
  const entries: [string, Playlist][] = playlists.map((playlist) => [playlist.id, playlist]);
  return Object.fromEntries(entries);
});

export const history = writable<string[]>([]);
export const queue = writable<string[]>([]);

export const blacklistedFolders = writable<string[]>([]);
export const filterSongDuration = writable(30);

export const artists = writable<Artist[]>([]);
export const artistsMap = derived(artists, (artists: Artist[]) => {
  const entries: [string, Artist][] = artists.map((artist) => [artist.name, artist]);
  return Object.fromEntries(entries);
});
export const genres = writable<Genre[]>([]);
export const genresMap = derived(genres, (genres: Genre[]) => {
  const entries: [string, Genre][] = genres.map((genre) => [genre.name, genre]);
  return Object.fromEntries(entries);
});

export const lastView = writable<View | null>(null);
export const isSwitchingView = writable(false);

// * Settings stores
export const palette = writable<Palette>("Auto");
export const useOledPalette = writable(false);
export const themePrimaryColor = writable("");

// # Now Playing Settings
export const showExtraSongInfo = writable(false);
export const nowPlayingTheme = writable(NowPlayingTheme.NORMAL);

export const dismissMiniPlayerWithSwipe = writable(true);
export const showVolumeControls = writable(true);
export const extraControl = writable<NowPlayingExtraControl>("Car Mode");

export const nowPlayingBackgroundType = writable(NowPlayingBackgroundType.GRADIENT);

// # Audio Settings
export const autoPlayOnConnect = writable(false);

// # Personalization Settings
export const viewsToRender = writable<View[]>([]);
export const viewIndices = writable<Record<View, number>>({
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
export const albums = writable<Album[]>([]);
export const albumsMap = derived(albums, (albums: Album[]) => {
  const entries: [string, Album][] = albums.map((album) => [album.name, album]);
  return Object.fromEntries(entries);
});
export const songs = writable<Song[]>([]);
export const songsMap = derived(songs, (songs: Song[]) => {
  const entries: [string, Song][] = songs.map((song) => [song.id, song]);
  return Object.fromEntries(entries);
});

function songProgressWritable(initial: number) {
  const { subscribe, set, update } = writable<number>(initial);
  
  return {
    subscribe,
    update,
    set: (value: number, updateBackend = true) => {
      set(value);

      if (updateBackend) invoke<void>("seek", { position: value });
    },
  };
}

export const songProgress = songProgressWritable(0);
export const playingSongId = writable<string>("");
export const nowPlayingList = writable<string>("");
export const nowPlayingType = writable<NowPlayingType>("Song");

// # View Settings
export const playlistGridSize = writable<GridSize>(GridSize.LARGE);
export const playlistSortOrder = writable<PlaylistSortOrder>("Alphabetical");

export const albumGridSize = writable<GridSize>(GridSize.LARGE);
export const albumSortOrder = writable<AlbumSortOrder>("Alphabetical");
export const useAlbumColors = writable<boolean>(true);

export const songGridSize = writable<GridSize>(GridSize.LIST);
export const songSortOrder = writable<SongSortOrder>("Alphabetical");

export const artistGridSize = writable<GridSize>(GridSize.LARGE);
export const artistGridStyle = writable<GridStyle>(GridStyle.CIRCULAR);
export const artistSortOrder = writable<ArtistSortOrder>("Alphabetical");
export const useArtistColors = writable<boolean>(true);

export const debugModeEnabled = writable(false);