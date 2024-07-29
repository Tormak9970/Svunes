import type { IconifyIcon } from "@iconify/types";
import Album from "@ktibow/iconset-material-symbols/album";
import Artist from "@ktibow/iconset-material-symbols/artist-rounded";
import Home from "@ktibow/iconset-material-symbols/home-rounded";
import LibraryMusic from "@ktibow/iconset-material-symbols/library-music-rounded";
import MusicNote from "@ktibow/iconset-material-symbols/music-note";
import QueueMusic from "@ktibow/iconset-material-symbols/queue-music-rounded";
import Search from "@ktibow/iconset-material-symbols/search-rounded";
import Settings from "@ktibow/iconset-material-symbols/settings";
import { t as translate } from "@stores/Locale";
import { get } from "svelte/store";

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
  const t = get(translate);
  
  switch(view){
    case View.PLAYLISTS:
      return t("PLAYLISTS_TITLE");
    case View.ALBUMS:
      return t("ALBUMS_TITLE");
    case View.SEARCH:
      return t("SEARCH_TITLE");
    case View.SONGS:
      return t("SONGS_TITLE");
    case View.SETTINGS:
      return t("SETTINGS_TITLE");
    case View.ARTISTS:
      return t("ARTISTS_TITLE");
    case View.GENRES:
      return t("GENRES_TITLE");
    case View.HOME:
      return t("HOME_TITLE");
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