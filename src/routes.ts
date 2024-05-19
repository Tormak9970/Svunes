import HomeLoadingAnimation from "./components/layout/loading-animations/HomeLoadingAnimation.svelte";
import AblumDetails from "./routes/albums/details/Details.svelte";
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

export const viewRoutesLUT = {
  0: "/playlists",
  1: "/albums",
  2: "/songs",
  3: "/artists",
  4: "/genres",
  5: "/search",
  6: "/settings",
  7: "/home"
}


export const routes = {
  "/": HomeLoadingAnimation,

  "/playlists": Playlists,
  "/playlists/:key": PlaylistDetails,

  "/albums": Albums,
  "/albums/:key": AblumDetails,
  "/albums/:key/edit": AlbumEditor,

  "/songs": Songs,
  "/songs/:key": SongDetails,
  "/songs/:key/edit": SongEditor,

  "/artists": Artists,
  "/artists/:key": ArtistDetails,

  "/genres": Genres,
  "/genres/:key": GenreDetails,

  "/search": Search,

  "/settings": Settings,

  "/home": Home
}