import { Playlist } from "../lib/models/Playlist";
import type { Song } from "../lib/models/Song";
import type { View } from "./View";

export enum NowPlayingTheme {
  NORMAL,
  CARD,
  CIRCLE,
  FULL,
  SIMPLE
}

/**
 * Gets a string to render for the given now playing theme.
 * @param theme The theme to get.
 */
export function getNowPlayingTheme(theme: NowPlayingTheme): string {
  switch (theme) {
    case NowPlayingTheme.NORMAL:
      return "Normal";
    case NowPlayingTheme.FULL:
      return "Full";
    case NowPlayingTheme.CARD:
      return "Card";
    case NowPlayingTheme.CIRCLE:
      return "Circle";
    case NowPlayingTheme.SIMPLE:
      return "Simple";
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

export type NowPlayingType = "Playlist" | "Album" | "Songs" | "Genre";

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
    songInfo: boolean,
    circularPlayButton: boolean,
    layout: NowPlayingTheme,
    useAlbumColors: boolean,
    useAlbumColorsForMini: boolean,
    controls: {
      dismissMiniWithSwipe: boolean,
      extraControls: boolean,
      volumeControls: boolean,
    }
  },

  audio: {
    fade: boolean,
    autoPlay: boolean,
    autoPlayBluetooth: boolean
  },

  personalization: {
    viewsToRender: View[],
    showSuggestions: boolean,
    trackHistory: boolean,
    showAlbumOnLockScreen: boolean
  },

  playlists: Playlist[],

  queue: Song[],

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
    songName: string,
    nowPlayingListName: string,
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

const FAVORITES_PLAYLIST = new Playlist(false, "Favorites", "", [], false, undefined, undefined, undefined, 0);

export const DEFAULT_SETTINGS: Settings = {
  "FILE_SIG_DO_NOT_EDIT": "dev.travislane.tunistic",
  "version": "",
  "palette": "Auto",
  "useOledPalette": false,
  "themePrimaryColor": "#a74bf2",
  "musicDirectories": [],
  "selectedView": 0,

  "nowPlaying": {
    "songInfo": false,
    "circularPlayButton": true,
    "layout": NowPlayingTheme.NORMAL,
    "useAlbumColors": true,
    "useAlbumColorsForMini": false,
    "controls": {
      "dismissMiniWithSwipe": true,
      "extraControls": true,
      "volumeControls": false,
    }
  },

  "audio": {
    "fade": false,
    "autoPlay": false,
    "autoPlayBluetooth": false
  },

  "personalization": {
    "viewsToRender": [0, 1, 2, 3, 5],
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
    "songName": "",
    "nowPlayingListName": "",
    "nowPlayingType": "Songs"
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