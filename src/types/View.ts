import type { IconifyIcon } from "@iconify/types";
import Album from "@ktibow/iconset-material-symbols/album";
import Artist from "@ktibow/iconset-material-symbols/artist-rounded";
import Home from "@ktibow/iconset-material-symbols/home-rounded";
import LibraryMusic from "@ktibow/iconset-material-symbols/library-music-rounded";
import MusicNote from "@ktibow/iconset-material-symbols/music-note";
import QueueMusic from "@ktibow/iconset-material-symbols/queue-music-rounded";
import Search from "@ktibow/iconset-material-symbols/search-rounded";
import Settings from "@ktibow/iconset-material-symbols/settings";

export enum View {
  PLAYLISTS,
  ALBUMS,
  SEARCH,
  SONGS,
  SETTINGS,
  ARTISTS,
  GENRES,
  HOME
}

export const Views = [
  View.PLAYLISTS,
  View.ALBUMS,
  View.SEARCH,
  View.SONGS,
  View.SETTINGS,
  View.ARTISTS,
  View.GENRES,
  View.HOME
];

/**
 * Gets the name of a given view.
 * @param view The view to get the name of.
 */
export function getViewName(view: View): string {
  switch(view){
    case View.PLAYLISTS:
      return "Playlists";
    case View.ALBUMS:
      return "Albums";
    case View.SEARCH:
      return "Search";
    case View.SONGS:
      return "Songs";
    case View.SETTINGS:
      return "Settings";
    case View.ARTISTS:
      return "Artists";
    case View.GENRES:
      return "Genres";
    case View.HOME:
      return "Home";
  }
}

/**
 * Gets the icon for a given view.
 * @param view The view to get the icon for.
 */
export function getViewIcon(view: View): IconifyIcon {
  switch(view){
    case View.PLAYLISTS:
      return QueueMusic;
    case View.ALBUMS:
      return Album;
    case View.SEARCH:
      return Search;
    case View.SONGS:
      return MusicNote;
    case View.SETTINGS:
      return Settings;
    case View.ARTISTS:
      return Artist;
    case View.GENRES:
      return LibraryMusic;
    case View.HOME:
      return Home;
  }
}

/**
 * Gets the route for a given view.
 * @param view The view to get the route for.
 */
export function getViewRoute(view: View): string {
  switch(view){
    case View.PLAYLISTS:
      return "/playlists";
    case View.ALBUMS:
      return "/albums";
    case View.SEARCH:
      return "/search";
    case View.SONGS:
      return "/songs";
    case View.SETTINGS:
      return "/settings";
    case View.ARTISTS:
      return "/artists";
    case View.GENRES:
      return "/genres";
    case View.HOME:
      return "/home";
  }
}