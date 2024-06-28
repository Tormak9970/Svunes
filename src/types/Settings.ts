import { Playlist } from "../lib/models/Playlist";
import type { View } from "./View";

export enum NowPlayingTheme {
  NORMAL,
  CARD,
  SIMPLE,
  FULL,
}

/**
 * Gets a string to render for the given now playing theme.
 * @param theme The theme to get.
 */
export function getNowPlayingTheme(theme: NowPlayingTheme): string {
  switch (theme) {
    case NowPlayingTheme.NORMAL:
      return "Normal";
    case NowPlayingTheme.CARD:
      return "Card";
    case NowPlayingTheme.SIMPLE:
      return "Simple";
    case NowPlayingTheme.FULL:
      return "Full";
  }
}

export enum NowPlayingBackgroundType {
  SOLID,
  GRADIENT,
  BLUR
}

/**
 * Gets a string to render for the given now playing background type.
 * @param type The type to get.
 */
export function getNowPlayingBackgroundType(type: NowPlayingBackgroundType): string {
  switch (type) {
    case NowPlayingBackgroundType.SOLID:
      return "Solid";
    case NowPlayingBackgroundType.GRADIENT:
      return "Gradient";
    case NowPlayingBackgroundType.BLUR:
      return "Blur";
  }
}

export enum GridSize {
  LIST,
  LARGE,
  MEDIUM,
  SMALL
}

export enum GridStyle {
  NORMAL,
  CARD,
  CIRCULAR,
  SQUARE
}

export enum AppLanguage {
  SYSTEM,
  ENGLISH
}

/**
 * Gets a string to render for the given app language.
 * @param lang The language to get.
 */
export function getLanguage(lang: AppLanguage): string {
  switch (lang) {
    case AppLanguage.SYSTEM:
      return "System Default";
    case AppLanguage.ENGLISH:
      return "English";
  }
}

export type Palette = "Auto" | "Dark" | "Light";

export type PlaylistSortOrder = "Alphabetical" | "Song Count" | "Most Played" | "Last Played";
export type AlbumSortOrder = "Alphabetical" | "Artist" | "Year" | "Length" | "Track Count" | "Most Played" | "Last Played";
export type SongSortOrder = "Alphabetical" | "Album" | "Artist" | "Year" | "Most Played" | "Last Played";
export type ArtistSortOrder = "Alphabetical" | "Album Count" | "Track Count";

export type AlbumEntriesSortOrder = "Alphabetical" | "Track Number" | "Song Duration";
export type ArtistEntriesSortOrder = "Alphabetical" | "Album" | "Year" | "Song Duration";

export type NowPlayingType = "Playlist" | "Album" | "Artist" | "Song" | "Genre";

export type SongMetadata = {
  lastPlayedOn: string | undefined,
  numTimesPlayed: number | undefined
}

export type AlbumMetadata = {
  lastPlayedOn: string | undefined,
  numTimesPlayed: number | undefined
}

export type ArtistMetadata = {
  imagePath: string | undefined,
}

export type Settings = {
  FILE_SIG_DO_NOT_EDIT: "dev.travislane.tunistic",
  version: string,

  palette: Palette,
  useOledPalette: boolean,
  themePrimaryColor: string,

  musicDirectories: string[],
  selectedView: View,

  nowPlaying: {
    layout: NowPlayingTheme,
    backgroundType: NowPlayingBackgroundType,
    songInfo: boolean,
    controls: {
      dismissMiniWithSwipe: boolean,
      volumeControls: boolean,
    }
  },

  audio: {
    autoPlay: boolean,
    autoPlayBluetooth: boolean
  },

  personalization: {
    viewsToRender: View[],
    viewIndices: Record<View, number>;
    showSuggestions: boolean,
    trackHistory: boolean,
    showAlbumOnLockScreen: boolean
  },

  playlists: Playlist[],

  queue: string[],

  blacklistedFolders: string[],
  pauseOnVolumeZero: boolean,
  filterSongDuration: number,
  selectedLanguage: AppLanguage,

  cache: {
    albumsMetadata: Record<string, AlbumMetadata>,
    artistsMetadata: Record<string, ArtistMetadata>,
    numSongs: number,
    songsMetadata: Record<string, SongMetadata>,
    songProgress: number,
    playingSongId: string,
    shuffle: boolean,
    repeat: boolean,
    volume: number,
    nowPlayingList: string,
    nowPlayingType: NowPlayingType
  },

  playlistsView: {
    gridSize: GridSize,
    sortOrder: PlaylistSortOrder
  },
  albumsView: {
    gridSize: GridSize,
    sortOrder: AlbumSortOrder,
    useAlbumColors: boolean
  },
  songsView: {
    gridSize: GridSize,
    sortOrder: SongSortOrder
  },
  artistsView: {
    gridSize: GridSize,
    gridStyle: GridStyle,
    sortOrder: ArtistSortOrder,
    useArtistColors: boolean
  }
}

const FAVORITES_PLAYLIST = new Playlist(undefined, false, "Favorites", "", [], false, undefined, undefined, 0);

export const DEFAULT_SETTINGS: Settings = {
  "FILE_SIG_DO_NOT_EDIT": "dev.travislane.tunistic",
  "version": "",
  "palette": "Auto",
  "useOledPalette": false,
  "themePrimaryColor": "#a74bf2",
  "musicDirectories": [],
  "selectedView": 0,

  "nowPlaying": {
    "layout": NowPlayingTheme.NORMAL,
    "backgroundType": NowPlayingBackgroundType.GRADIENT,
    "songInfo": false,
    "controls": {
      "dismissMiniWithSwipe": true,
      "volumeControls": true,
    }
  },

  "audio": {
    "autoPlay": false,
    "autoPlayBluetooth": false
  },

  "personalization": {
    "viewsToRender": [0, 1, 2, 3, 5],
    "viewIndices": {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7
    },
    "showSuggestions": true,
    "trackHistory": true,
    "showAlbumOnLockScreen": true
  },

  "playlists": [
    FAVORITES_PLAYLIST
  ],

  "queue": [],

  "blacklistedFolders": [],
  "pauseOnVolumeZero": false,
  "filterSongDuration": 30,
  "selectedLanguage": AppLanguage.SYSTEM,

  "cache": {
    "artistsMetadata": {},
    "albumsMetadata": {},
    "numSongs": 0,
    "songsMetadata": {},
    "songProgress": 0,
    "playingSongId": "",
    "shuffle": true,
    "repeat": true,
    "volume": 1,
    "nowPlayingList": "",
    "nowPlayingType": "Song"
  },

  "playlistsView": {
    "gridSize": GridSize.LARGE,
    "sortOrder": "Alphabetical"
  },
  "albumsView": {
    "gridSize": GridSize.LARGE,
    "sortOrder": "Alphabetical",
    "useAlbumColors": true
  },
  "songsView": {
    "gridSize": GridSize.LIST,
    "sortOrder": "Alphabetical"
  },
  "artistsView": {
    "gridSize": GridSize.LARGE,
    "gridStyle": GridStyle.CIRCULAR,
    "sortOrder": "Alphabetical",
    "useArtistColors": true
  }
};