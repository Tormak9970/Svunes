export enum View {
  PLAYLISTS,
  ALBUMS,
  SONGS,
  ARTISTS,
  GENRES,
  SETTINGS,
  HOME,
  SEARCH
}

export const Views = [
  View.PLAYLISTS,
  View.ALBUMS,
  View.SONGS,
  View.ARTISTS,
  View.GENRES,
  View.SETTINGS,
  View.HOME,
  View.SEARCH
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
    case View.SONGS:
      return "Songs";
    case View.ARTISTS:
      return "Artists";
    case View.GENRES:
      return "Genres";
    case View.SETTINGS:
      return "Settings";
    case View.HOME:
      return "Home";
    case View.SEARCH:
      return "Search";
  }
}