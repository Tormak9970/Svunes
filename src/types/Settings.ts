import type { Album } from "../lib/models/Album";
import type { Artist } from "../lib/models/Artist";
import type { Playlist } from "../lib/models/Playlist";
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
  TWO,
  THEE
}

export enum GridStyle {
  NORMAL,
  CARD,
  CIRCULAR,
  SQUARE
}

export type PlaylistSortOrder = "Alphabetical" | "Last Played";
export type AlbumSortOrder = "Alphabetical" | "Last Played" | "Year" | "Length" | "Song Count";
export type SongSortOrder = "Alphabetical" | "Last Played" | "Year" | "Length";
export type ArtistSortOrder = "Alphabetical" | "Album Count" | "Song Count";

export type NowPlayingType = "Playlist" | "Album" | "Songs" | "Genre";

export type Settings = {
  version: string,
  themePrimaryColor: string,
  musicDirectories: string[],
  selectedView: View,

  nowPlaying: {
    songInfo: boolean,
    circularPlayButton: boolean,
    layout: NowPlayingLayout,
    albumTheme: NowPlayingAlbumTheme,
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

  cache: {
    albums: Album[],
    numSongs: number,
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
    sortOrder: AlbumSortOrder
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

export const DEFAULT_SETTINGS: Settings = {
  "version": "",
  "themePrimaryColor": "#7bdd69",
  "musicDirectories": [],
  "selectedView": 0,

  "nowPlaying": {
    "songInfo": false,
    "circularPlayButton": false,
    "layout": NowPlayingLayout.NORMAL,
    "albumTheme": NowPlayingAlbumTheme.NORMAL,
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

  "playlists": [],

  "queue": [],

  "cache": {
    "albums": [],
    "numSongs": 0,
    "songProgress": 0,
    "songName": "",
    "nowPlayingListName": "",
    "nowPlayingType": "Songs"
  },

  "playlistsView": {
    "gridSize": GridSize.TWO,
    "sortOrder": "Alphabetical"
  },
  "albumsView": {
    "gridSize": GridSize.TWO,
    "sortOrder": "Alphabetical"
  },
  "songsView": {
    "gridSize": GridSize.LIST,
    "sortOrder": "Alphabetical"
  },
  "artistsView": {
    "gridSize": GridSize.TWO,
    "gridStyle": GridStyle.CIRCULAR,
    "sortOrder": "Alphabetical"
  }
};