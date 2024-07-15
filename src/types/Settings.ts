import { Playlist } from "../lib/models/Playlist";
import t from "../lib/utils/i18n";
import { hash64 } from "../lib/utils/Utils";
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
      return t("NOW_PLAYING_THEME_NORMAL");
    case NowPlayingTheme.CARD:
      return t("NOW_PLAYING_THEME_CARD");
    case NowPlayingTheme.SIMPLE:
      return t("NOW_PLAYING_THEME_SIMPLE");
    case NowPlayingTheme.FULL:
      return t("NOW_PLAYING_THEME_FULL");
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
      return t("NOW_PLAYING_BACKGROUND_SOLID");
    case NowPlayingBackgroundType.GRADIENT:
      return t("NOW_PLAYING_BACKGROUND_GRADIENT");
    case NowPlayingBackgroundType.BLUR:
      return t("NOW_PLAYING_BACKGROUND_BLUR");
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

export type NowPlayingExtraControl = "Car Mode" | "Sleep Timer" | "None";

export type Palette = "Auto" | "Dark" | "Light";

export type PlaylistSortOrder = "Alphabetical" | "Song Count" | "Most Played" | "Last Played";
export type AlbumSortOrder = "Alphabetical" | "Artist" | "Year" | "Length" | "Track Count" | "Most Played" | "Last Played";
export type SongSortOrder = "Alphabetical" | "Album" | "Artist" | "Year" | "Most Played" | "Last Played";
export type ArtistSortOrder = "Alphabetical" | "Album Count" | "Track Count";

export type AlbumEntriesSortOrder = "Alphabetical" | "Track Number" | "Song Duration";
export type ArtistEntriesSortOrder = "Alphabetical" | "Album" | "Year" | "Song Duration";

export type NowPlayingType = "Playlist" | "Album" | "Artist" | "Song" | "Genre";

export type SongMetadata = {
  dateAdded: string | undefined;
  lastPlayedOn: string | undefined;
  numTimesPlayed: number | undefined;
}

export type AlbumMetadata = {
  lastPlayedOn: string | undefined;
  numTimesPlayed: number | undefined;
}

export type ArtistMetadata = {
  imagePath: string | undefined;
}

export type Settings = {
  FILE_SIG_DO_NOT_EDIT: "dev.travislane.tunistic";
  version: string;

  palette: Palette;
  useOledPalette: boolean;
  themePrimaryColor: string;

  musicDirectories: string[];
  selectedView: View;

  nowPlaying: {
    layout: NowPlayingTheme;
    backgroundType: NowPlayingBackgroundType;
    songInfo: boolean;
    controls: {
      dismissMiniWithSwipe: boolean;
      volumeControls: boolean;
      extralControl: NowPlayingExtraControl;
    };
    autoDetectCarMode: boolean;
  };

  audio: {
    autoPlay: boolean;
  };

  personalization: {
    viewsToRender: View[];
    viewIndices: Record<View, number>;
    showSuggestions: boolean;
    trackHistory: boolean;
    showAlbumOnLockScreen: boolean;
  };

  playlists: Playlist[];

  queue: string[];

  blacklistedFolders: string[];
  filterSongDuration: number;
  selectedLanguage: string;

  cache: {
    albumsMetadata: Record<string, AlbumMetadata>;
    artistsMetadata: Record<string, ArtistMetadata>;
    numSongs: number;
    songsMetadata: Record<string, SongMetadata>;
    songProgress: number;
    playingSongId: string;
    shuffle: boolean;
    repeat: boolean;
    volume: number;
    nowPlayingList: string;
    nowPlayingType: NowPlayingType;
  };

  playlistsView: {
    gridSize: GridSize;
    sortOrder: PlaylistSortOrder;
  };
  albumsView: {
    gridSize: GridSize;
    sortOrder: AlbumSortOrder;
    useAlbumColors: boolean;
  };
  songsView: {
    gridSize: GridSize;
    sortOrder: SongSortOrder;
  };
  artistsView: {
    gridSize: GridSize;
    gridStyle: GridStyle;
    sortOrder: ArtistSortOrder;
    useArtistColors: boolean;
  }
}

const FAVORITES_PLAYLIST = new Playlist(hash64("Favorites"), false, "Favorites", "", [], false, undefined, undefined, 0);

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
      "extralControl": "Car Mode",
    },
    "autoDetectCarMode": true,
  },

  "audio": {
    "autoPlay": false
  },

  "personalization": {
    "viewsToRender": [0, 1, 2, 3, 4],
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
  "filterSongDuration": 30,
  "selectedLanguage": "system",

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