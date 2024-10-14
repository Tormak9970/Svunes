import DesktopQueue from "@views/DesktopQueue.svelte";
import type { ComponentType } from "svelte";
import type { WrappedComponent } from "svelte-spa-router";
import wrap from "svelte-spa-router/wrap";
import { get, type Readable } from "svelte/store";
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
import { albumsMap, artistsMap, genresMap } from "./stores/State";

/**
 * Creates a route guard that checks if the key param still exists when the route is loaded.
 * @param component The component to render if the guard passes.
 * @param mapStore The entry map store.
 * @param reason The reason to use if the guard fails.
 * @returns The route guard.
 */
function keyDeleteGuard(component: ComponentType, mapStore: Readable<{ [k: string]: any }>, reason: string): WrappedComponent {
  return wrap({
    component: component,
    userData: {
      reason: "none"
    },
    conditions: [
      (detail) => {
        const key = detail.params!.key;
        const entry = get(mapStore)[key];
        // @ts-expect-error reason does exist.
        detail.userData!.reason = reason;
        return !!entry;
      }
    ]
  })
}

/**
 * The app's routes.
 */
export const routes = {
  "/": HomeLoadingAnimation,

  "/playlists": Playlists,
  "/side/playlists/*": Playlists,
  "/playlists/:id": PlaylistDetails,
  "/playlists/:id/edit": PlaylistEditor,

  "/albums": Albums,
  "/albums/:key": keyDeleteGuard(AblumDetails, albumsMap, "album-key-dne"),
  "/albums/:key/edit": AlbumEditor,
  "/albums/:key/albums-by-artist": AlbumsByArtist,

  "/songs": Songs,
  "/songs/bulk-edit": BulkEdit,
  "/songs/:id": SongDetails,
  "/songs/:id/edit": SongEditor,

  "/artists": Artists,
  "/artists/:key": keyDeleteGuard(ArtistDetails, artistsMap, "artist-key-dne"),
  "/artists/:key/similar": SimilarArtists,

  "/genres": Genres,
  "/genres/:key": keyDeleteGuard(GenreDetails, genresMap, "genre-key-dne"),

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
  "/queue": DesktopQueue,
}