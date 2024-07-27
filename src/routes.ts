import type { ComponentType } from "svelte";
import { location, type RoutePrecondition, type WrappedComponent } from "svelte-spa-router";
import wrap from "svelte-spa-router/wrap";
import { get } from "svelte/store";
import HomeLoadingAnimation from "./components/layout/loading-animations/HomeLoadingAnimation.svelte";
import Albums from "./routes/albums/Albums.svelte";
import AlbumsByArtist from "./routes/albums/AlbumsByArtist.svelte";
import AblumDetails from "./routes/albums/Details.svelte";
import AlbumEditor from "./routes/albums/Edit.svelte";
import Artists from "./routes/artists/Artists.svelte";
import ArtistDetails from "./routes/artists/Details.svelte";
import SimilarArtists from "./routes/artists/SimilarArtists.svelte";
import GenreDetails from "./routes/genres/Details.svelte";
import Genres from "./routes/genres/Genres.svelte";
import History from "./routes/home/History.svelte";
import Home from "./routes/home/Home.svelte";
import MostPlayed from "./routes/home/MostPlayed.svelte";
import RecentlyAdded from "./routes/home/RecentlyAdded.svelte";
import TopAlbums from "./routes/home/TopAlbums.svelte";
import TopArtists from "./routes/home/TopArtists.svelte";
import MetadataParser from "./routes/MetadataParser.svelte";
import PlaylistDetails from "./routes/playlists/Details.svelte";
import PlaylistEditor from "./routes/playlists/Edit.svelte";
import Playlists from "./routes/playlists/Playlists.svelte";
import Search from "./routes/Search.svelte";
import AboutSettings from "./routes/settings/About.svelte";
import AppearanceSettings from "./routes/settings/Appearance.svelte";
import AudioSettings from "./routes/settings/Audio.svelte";
import BackupSettings from "./routes/settings/Backup.svelte";
import LanguageSettings from "./routes/settings/Language.svelte";
import NowPlayingSettings from "./routes/settings/NowPlaying.svelte";
import PersonalizeSettings from "./routes/settings/Personalize.svelte";
import Settings from "./routes/settings/Settings.svelte";
import SongFilteringSettings from "./routes/settings/SongFiltering.svelte";
import BulkEdit from "./routes/songs/BulkEdit.svelte";
import SongDetails from "./routes/songs/Details.svelte";
import SongEditor from "./routes/songs/Edit.svelte";
import Songs from "./routes/songs/Songs.svelte";
import { albumsMap } from "./stores/State";

export const sidePanelPrefix = "/side";
export const sidePanelRoutes = {
  "/playlists/:id": PlaylistDetails,
  "/playlists/:id/edit": PlaylistEditor,

  "/albums/:key": handleAltRoute(AblumDetails, [
    (detail) => {
      const key = detail.params!.key;
      const album = get(albumsMap)[key];
      // @ts-expect-error reason does exist.
      detail.userData!.reason = "album-key-dne";
      return !!album;
    }
  ]),
  "/albums/:key/alt": handleAltRoute(AblumDetails),
  "/albums/:key/edit": AlbumEditor,
  "/albums/:key/albums-by-artist": AlbumsByArtist,

  "/songs/bulk-edit": BulkEdit,
  "/songs/:id": handleAltRoute(SongDetails),
  "/songs/:id/alt": handleAltRoute(SongDetails),
  "/songs/:id/edit": SongEditor,

  "/artists/:key": handleAltRoute(ArtistDetails),
  "/artists/:key/alt": handleAltRoute(ArtistDetails),
  "/artists/:key/similar": SimilarArtists,

  "/genres/:key": GenreDetails,
}

// function handleSideRoute(component: ComponentType, conditions: RoutePrecondition[] = []): WrappedComponent {
//   return wrap({
//     component: component,
//     userData: {
//       reason: "none"
//     },
//     conditions: [
//       (detail) => {
        
//       },
//       ...conditions
//     ]
//   });
// }

function handleAltRoute(component: ComponentType, conditions: RoutePrecondition[] = []): WrappedComponent {
  return wrap({
    component: component,
    userData: {
      reason: "none"
    },
    conditions: [
      (detail) => {
        console.log(get(location));
        console.log(detail.location);
        console.log(history.state);
        return true;
      },
      ...conditions
    ]
  });
}

/**
 * The app's routes.
 */
export const routes = {
  "/": HomeLoadingAnimation,

  "/playlists": Playlists,
  "/playlists/:id": PlaylistDetails,
  "/playlists/:id/edit": PlaylistEditor,

  "/albums": Albums,
  "/albums/:key": handleAltRoute(AblumDetails, [
    (detail) => {
      const key = detail.params!.key;
      const album = get(albumsMap)[key];
      // @ts-expect-error reason does exist.
      detail.userData!.reason = "album-key-dne";
      return !!album;
    }
  ]),
  "/albums/:key/alt": handleAltRoute(AblumDetails),
  "/albums/:key/edit": AlbumEditor,
  "/albums/:key/albums-by-artist": AlbumsByArtist,

  "/songs": Songs,
  "/songs/bulk-edit": BulkEdit,
  "/songs/:id": handleAltRoute(SongDetails),
  "/songs/:id/alt": handleAltRoute(SongDetails),
  "/songs/:id/edit": SongEditor,

  "/artists": Artists,
  "/artists/:key": handleAltRoute(ArtistDetails),
  "/artists/:key/alt": handleAltRoute(ArtistDetails),
  "/artists/:key/similar": SimilarArtists,

  "/genres": Genres,
  "/genres/:key": GenreDetails,

  "/search": Search,

  "/settings": Settings,
  "/settings/appearance": AppearanceSettings,
  "/settings/now-playing": NowPlayingSettings,
  "/settings/audio": AudioSettings,
  "/settings/personalize": PersonalizeSettings,
  "/settings/song-filtering": SongFilteringSettings,
  "/settings/language": LanguageSettings,
  "/settings/backup": BackupSettings,
  "/settings/about": AboutSettings,

  "/home": Home,
  "/home/history": History,
  "/home/most-played": MostPlayed,
  "/home/recently-added": RecentlyAdded,
  "/home/top-artists": TopArtists,
  "/home/top-albums": TopAlbums,

  "/metadata-parser": MetadataParser,
}