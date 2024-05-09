import type { Album } from "../lib/models/Album";
import type { Playlist } from "../lib/models/Playlist";
import type { Song } from "../lib/models/Song";
import type { View } from "./View";

export enum GridSize {
  LIST,
  TWO,
  THEE
}

export type PlaylistSortOrder = "Alphabetical" | "Last Played";
export type AlbumSortOrder = "Alphabetical" | "Last Played" | "Year" | "Length" | "Song Count";
export type SongSortOrder = "Alphabetical" | "Last Played" | "Year" | "Length";

export type Settings = {
  version: string,
  themePrimaryColor: string,
  selectedView: View,
  viewsToRender: View[],

  nowPlaying: {
    progress: number,
    layout: number // ! This is a potential feature for the future
  },

  queue: Song[],

  playlistsView: {
    gridSize: GridSize,
    sortOrder: PlaylistSortOrder,
    playlists: Playlist[]
  },
  albumsView: {
    gridSize: GridSize,
    sortOrder: AlbumSortOrder,
    albums: Album[]
  },
  songsView: {
    gridSize: GridSize,
    sortOrder: SongSortOrder,
    albums: Song[]
  },
  // genresView: {
  //   gridSize: GridSize
  // },
  // artistsView: {
  //   gridSize: GridSize
  // }
}

export const DEFAULT_SETTINGS: Settings = {
  "version": "",
  "selectedView": 0,
  "viewsToRender": [0, 1, 2, 3, 5]
};