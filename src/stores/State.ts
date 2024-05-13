import { derived, writable, type Readable, type Writable } from "svelte/store";
import { View } from "../types/View";
import { GridSize, GridStyle, NowPlayingAlbumTheme, NowPlayingLayout, type AlbumSortOrder, type ArtistSortOrder, type NowPlayingType, type PlaylistSortOrder, type SongSortOrder } from "../types/Settings";
import type { Playlist } from "../lib/models/Playlist";
import type { Song } from "../lib/models/Song";
import type { Album } from "../lib/models/Album";
import type { Artist } from "../lib/models/Artist";
import type { Genre } from "../lib/models/Genre";

export const isLoading = writable(true);

// * View stores
export const showViewNav = writable(true);
export const musicDirectories: Writable<string[]> = writable([]);
export const selectedView: Writable<View> = writable(-1 as View);

export const showMiniPlayer = writable(true);

export const playlists: Writable<Playlist[]> = writable([]);
export const playlistsMap: Readable<Record<string, Playlist>> = derived(playlists, (playlists: Playlist[]) => {
  const entries: [string, Playlist][] = playlists.map((playlist) => [playlist.name, playlist]);
  return Object.fromEntries(entries);
});
export const queue: Writable<Song[]> = writable([]);
export const hiddenSongs: Writable<Song[]> = writable([]);

export const artists: Writable<Artist[]> = writable([]);
export const artistsMap: Readable<Record<string, Artist>> = derived(artists, (artists: Artist[]) => {
  const entries: [string, Artist][] = artists.map((artist) => [artist.name, artist]);
  return Object.fromEntries(entries);
});
export const genres: Writable<Genre[]> = writable([]);
export const genresMap: Readable<Record<string, Genre>> = derived(genres, (genres: Genre[]) => {
  const entries: [string, Genre][] = genres.map((genre) => [genre.name, genre]);
  return Object.fromEntries(entries);
});

// * Settings stores
export const themePrimaryColor = writable("#7bdd69");

// # Now Playing Settings
export const showSongInfo = writable(false);
export const circularPlayButton = writable(false);
export const nowPlayingLayout = writable(NowPlayingLayout.NORMAL);
export const nowPlayingAlbumTheme = writable(NowPlayingAlbumTheme.NORMAL);

export const dismissMiniPlayerWithSwipe = writable(true);
export const showExtraControls = writable(true);
export const showVolumeControls = writable(false);

export const nowPlayingUseAlbumColors = writable(true);
export const nowPlayingMiniUseAlbumColors = writable(false);

// # Audio Settings
export const fadeAudioOnPause = writable(false);
export const autoPlayOnConnect = writable(false);
export const autoPlayOnBluetooth = writable(false);

// # Personalization Settings
export const viewsToRender: Writable<View[]> = writable([])
export const showSuggestions = writable(true);
export const trackHistory = writable(true);
export const showAlbumOnLockScreen = writable(true);

// # Cache Settings
export const albums: Writable<Album[]> = writable([]);
export const albumsMap: Readable<Record<string, Album>> = derived(albums, (albums: Album[]) => {
  const entries: [string, Album][] = albums.map((album) => [album.name, album]);
  return Object.fromEntries(entries);
});
export const songs: Writable<Song[]> = writable([]);
export const songsMap: Readable<Record<string, Song>> = derived(songs, (songs: Song[]) => {
  const entries: [string, Song][] = songs.map((song) => [song.title, song]);
  return Object.fromEntries(entries);
});
export const songProgress = writable(0);
export const songName: Writable<string> = writable("");
export const nowPlayingListName: Writable<string> = writable("");
export const nowPlayingType: Writable<NowPlayingType> = writable("Songs");

// # View Settings
export const playlistGridSize: Writable<GridSize> = writable(GridSize.TWO);
export const playlistSortOrder: Writable<PlaylistSortOrder> = writable("Alphabetical");

export const albumGridSize: Writable<GridSize> = writable(GridSize.TWO);
export const albumSortOrder: Writable<AlbumSortOrder> = writable("Alphabetical");
export const useAlbumColors: Writable<boolean> = writable(true);

export const songGridSize: Writable<GridSize> = writable(GridSize.LIST);
export const songSortOrder: Writable<SongSortOrder> = writable("Alphabetical");

export const artistGridSize: Writable<GridSize> = writable(GridSize.TWO);
export const artistGridStyle: Writable<GridStyle> = writable(GridStyle.CIRCULAR);
export const artistSortOrder: Writable<ArtistSortOrder> = writable("Alphabetical");