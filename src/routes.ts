import HomeLoadingAnimation from "./components/layout/loading-animations/HomeLoadingAnimation.svelte";
import AblumDetails from "./routes/albums/Details.svelte";
import ArtistDetails from "./routes/artists/Details.svelte";
import GenreDetails from "./routes/genres/Details.svelte";
import SongDetails from "./routes/songs/Details.svelte";
import AlbumEditor from "./routes/albums/Edit.svelte";
import SongEditor from "./routes/songs/Edit.svelte";
import Albums from "./routes/albums/Albums.svelte";
import Artists from "./routes/artists/Artists.svelte";
import Genres from "./routes/genres/Genres.svelte";
import Home from "./routes/Home.svelte";
import Playlists from "./routes/playlists/Playlists.svelte";
import Search from "./routes/Search.svelte";
import Settings from "./routes/settings/Settings.svelte";
import Songs from "./routes/songs/Songs.svelte";
import PlaylistDetails from "./routes/playlists/Details.svelte";
import AppearanceSettings from "./routes/settings/Appearance.svelte";
import NowPlayingSettings from "./routes/settings/NowPlaying.svelte";
import AudioSettings from "./routes/settings/Audio.svelte";
import PersonalizeSettings from "./routes/settings/Personalize.svelte";
import OtherSettings from "./routes/settings/Other.svelte";
import BackupSettings from "./routes/settings/Backup.svelte";
import AboutSettings from "./routes/settings/About.svelte";
import PlaylistEditor from "./routes/playlists/Edit.svelte";
import AlbumsByArtist from "./routes/albums/AlbumsByArtist.svelte";
import SimilarArtists from "./routes/artists/SimilarArtists.svelte";

/**
 * A LUT for mapping Views to their routes.
 */
export const viewRoutesLUT = {
  0: "/playlists",
  1: "/albums",
  2: "/songs",
  3: "/artists",
  4: "/genres",
  5: "/settings",
  6: "/search",
  7: "/home"
}

/**
 * The app's routes.
 */
export const routes = {
  "/": HomeLoadingAnimation,

  "/playlists": Playlists,
  "/playlists/:key": PlaylistDetails,
  "/playlists/:key/edit": PlaylistEditor,

  "/albums": Albums,
  "/albums/:key": AblumDetails,
  "/albums/:key/alt": AblumDetails,
  "/albums/:key/edit": AlbumEditor,
  "/albums/:key/albums-by-artist": AlbumsByArtist,

  "/songs": Songs,
  "/songs/:key": SongDetails,
  "/songs/:key/edit": SongEditor,

  "/artists": Artists,
  "/artists/:key": ArtistDetails,
  "/artists/:key/alt": ArtistDetails,
  "/artists/:key/similar": SimilarArtists,

  "/genres": Genres,
  "/genres/:key": GenreDetails,

  "/search": Search,

  "/settings": Settings,
  "/settings/appearance": AppearanceSettings,
  "/settings/now-playing": NowPlayingSettings,
  "/settings/audio": AudioSettings,
  "/settings/personalize": PersonalizeSettings,
  "/settings/other": OtherSettings,
  "/settings/backup": BackupSettings,
  "/settings/about": AboutSettings,

  "/home": Home
  // "/home/top-artists": TopArtists,
  // "/home/top-albums": TopAlbums,
  // "/home/most-played": MostPlayed,

  // "/history": History,
}