import type { Album } from "../lib/models/Album";
import { Playlist } from "../lib/models/Playlist";
import type { Song } from "../lib/models/Song";
import type { View } from "./View";

export enum NowPlayingLayout {
  NORMAL
}

export enum NowPlayingAlbumTheme {
  NORMAL,
  FULL,
  FULL_CARD,
  CARD,
  CIRCULAR
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

export enum APP_LANGUAGE {
  SYSTEM,
  ENGLISH
}

/**
 * Gets a string to render for the given app language.
 * @param lang The language to get.
 */
export function getLanguage(lang: APP_LANGUAGE): string {
  switch (lang) {
    case APP_LANGUAGE.SYSTEM:
      return "System Default";
    case APP_LANGUAGE.ENGLISH:
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
    layout: NowPlayingLayout,
    albumTheme: NowPlayingAlbumTheme,
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
  selectedLanguage: APP_LANGUAGE,

  cache: {
    albumsMetadata: Record<string, AlbumMetadata>,
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
    sortOrder: ArtistSortOrder
  }
}

const FAVORITES_PLAYLIST = new Playlist("Favorites", [], false, undefined, undefined, undefined, 0);

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
    "circularPlayButton": false,
    "layout": NowPlayingLayout.NORMAL,
    "albumTheme": NowPlayingAlbumTheme.NORMAL,
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
  "selectedLanguage": APP_LANGUAGE.SYSTEM,

  "cache": {
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
    "sortOrder": "Alphabetical"
  }
};