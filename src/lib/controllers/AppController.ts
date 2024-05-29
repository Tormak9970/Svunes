import { showEditMusicFolders } from "../../stores/Modals";
import { RustInterop } from "./RustInterop";
import { albums, artists, blacklistedFolders, genres, isLoading, musicDirectories, nowPlayingListName, nowPlayingType, playlists, queue, showInfoSnackbar, showMiniPlayer, songName, songProgress, songs } from "../../stores/State";
import { get, type Unsubscriber } from "svelte/store";
import { Song } from "../models/Song";
import { Album } from "../models/Album";
import { SettingsController } from "./SettingsController";
import { LogController } from "./LogController";
import { Genre } from "../models/Genre";
import { Artist } from "../models/Artist";
import type { AlbumMetadata, ArtistMetadata, SongMetadata } from "../../types/Settings";
import { getAllArtistNames } from "../utils/Utils";
import type { Playlist } from "../models/Playlist";
import { DialogController } from "./DialogController";

/**
 * The core app controller.
 */
export class AppController {
  private static musicFoldersSub: Unsubscriber;
  private static blacklistFoldersSub: Unsubscriber;
  private static oldBlacklist: string[] = [];

  /**
   * Initializes the app.
   */
  static async init() {
    this.oldBlacklist = get(blacklistedFolders);

    this.musicFoldersSub = musicDirectories.subscribe((folders) => {
      this.loadSongs(folders, get(blacklistedFolders));
    });
    this.blacklistFoldersSub = blacklistedFolders.subscribe((folders) => {
      if (JSON.stringify(folders) !== JSON.stringify(this.oldBlacklist)) {
        this.oldBlacklist = folders;
        this.loadSongs(get(musicDirectories), folders);
      }
    });
  }

  /**
   * Function to run on cleanup.
   */
  static destroy() {
    if (this.musicFoldersSub) this.musicFoldersSub();
    if (this.blacklistFoldersSub) this.blacklistFoldersSub();
  }

  /**
   * Resets the now playing stores.
   */
  static resetNowPlaying() {
    showMiniPlayer.set(false);
    songProgress.set(0);
    songName.set("");
    queue.set([]);
    nowPlayingListName.set("");
    nowPlayingType.set("Songs");
  }

  /**
   * Generates all of the albums from the loaded songs.
   * @param songs The loaded songs.
   */
  private static loadAlbumsFromSongs(songs: Song[]) {
    const albumsMetadataMap = SettingsController.getSetting<Record<string, AlbumMetadata>>("cache.albumsMetadata");
    const albumMap = new Map<string, Album>();

    for (const song of songs) {
      if (song.album) {
        if (!albumMap.get(song.album)) {
          const metadata = albumsMetadataMap[song.album];
          const album = new Album(song.album, song.artPath, song.albumArtist, song.releaseYear, song.genre, metadata?.lastPlayedOn, metadata?.numTimesPlayed);
          album.songKeys.push(song.key);
          
          if (song.artist) album.artists.add(song.artist);
  
          albumMap.set(album.name, album);
        } else {
          const album = albumMap.get(song.album)!;
          album.songKeys.push(song.key);
          
          if (song.artist) album.artists.add(song.artist);
          if (!album.albumArtist) album.albumArtist = song.albumArtist;
          if (!album.artPath) album.artPath = song.artPath;
        }
      }
    }

    const newAlbumsList = Array.from(albumMap.values());
    albums.set(newAlbumsList);
    
    LogController.log(`Loaded ${newAlbumsList.length} albums.`);
  }

  /**
   * Generates all of the artists from the loaded songs.
   * @param songs The loaded songs.
   */
  private static loadArtistsFromSongs(songs: Song[]) {
    const artistsMetadataMap = SettingsController.getSetting<Record<string, ArtistMetadata>>("cache.artistsMetadata");
    const artistMap = new Map<string, Artist>();

    for (const song of songs) {
      if (song.artist) {
        for (const artistName of getAllArtistNames(song.artist)) {
          if (!artistMap.get(artistName)) {
            const metadata = artistsMetadataMap[artistName];
            const artist = new Artist(artistName, metadata?.imagePath ?? song.artPath);
            artist.songKeys.push(song.key);
            
            if (song.album && song.albumArtist?.includes(artistName)) artist.albumNames.add(song.album);
            if (song.genre) artist.genres.add(song.genre);
    
            artistMap.set(artistName, artist);
          } else {
            const artist = artistMap.get(artistName)!;
            artist.songKeys.push(song.key);
  
            if (song.album && song.albumArtist?.includes(artistName)) artist.albumNames.add(song.album);
            if (song.genre) artist.genres.add(song.genre);
            if (!artist.imagePath) artist.imagePath = song.artPath;
          }
        }
      }
    }

    const artistList = Array.from(artistMap.values());
    artists.set(artistList);

    LogController.log(`Loaded ${artistList.length} artists.`).then(() => {
      // * This is kinda dumb but it works.
      isLoading.set(false);
    });
  }

  /**
   * Generates all of the genres from the loaded songs.
   * @param songs The loaded songs.
   */
  private static loadGenresFromSongs(songs: Song[]) {
    const genreMap = new Map<string, Genre>();

    for (const song of songs) {
      const songGenre = song.genre ?? "Other";

      if (!genreMap.get(songGenre)) {
        const genre = new Genre(songGenre, song.artPath);
        genre.songKeys.push(song.key);

        if (song.artist) {
          for (const artist of getAllArtistNames(song.artist)) {
            genre.artists.add(artist);
          }
        }

        genreMap.set(songGenre, genre);
      } else {
        const genre = genreMap.get(songGenre)!;
        genre.songKeys.push(song.key);

        if (!genre.imagePreviewPath) genre.imagePreviewPath = song.artPath;
        if (song.artist) {
          for (const artist of getAllArtistNames(song.artist)) {
            genre.artists.add(artist);
          }
        }
      }
    }

    const genreList = Array.from(genreMap.values());
    genres.set(genreList);

    LogController.log(`Loaded ${genreList.length} genres.`);
  }

  /**
   * Reads songs from the provided folders.
   * @param musicFolders The folders to read music from.
   * @param blacklistedFolders The user's blacklisted folders.
   */
  static async loadSongs(musicFolders: string[], blacklistedFolders: string[]) {
    const maxLength = SettingsController.getSetting<number>("filterSongDuration") * 60;
    const songsMetadataMap = SettingsController.getSetting<Record<string, SongMetadata>>("cache.songsMetadata");

    if (musicFolders.length === 0) {
      showEditMusicFolders.set(true);
    } else {
      const songsJson = await RustInterop.readMusicFolders(musicFolders, blacklistedFolders, maxLength);
      const loadedSongs: Song[] = songsJson.map((json) => {
        const song = Song.fromJSON(json);
        const metadata = songsMetadataMap[song.key];
        
        if (metadata) {
          song.lastPlayedOn = metadata.lastPlayedOn ?? "Never";
          song.numTimesPlayed = metadata.numTimesPlayed ?? 0;
        }

        return song;
      });

      const songsWithMissingArt = loadedSongs.filter((song) => !song.artPath);

      const pathCache: Record<string, string> = {};
      const blacklist: string[] = [];

      for (const song of songsWithMissingArt) {
        if (song.album) {
          if (!blacklist.includes(song.album)) {
            if (!pathCache[song.album]) {
              const songWithPath = loadedSongs.find((s) => s.album === song.album && s.artPath);
              if (songWithPath && songWithPath.artPath) {
                pathCache[song.album] = songWithPath.artPath;
                song.artPath = songWithPath.artPath;
              } else {
                blacklist.push(song.album);
              }
            } else {
              song.artPath = pathCache[song.album];
            }
          }
        }
      }
      
      if (SettingsController.getSetting<number>("cache.numSongs") !== loadedSongs.length) this.resetNowPlaying();
      songs.set(loadedSongs);
      LogController.log(`Loaded ${loadedSongs.length} songs.`);

      this.loadAlbumsFromSongs(loadedSongs);
      this.loadGenresFromSongs(loadedSongs);
      this.loadArtistsFromSongs(loadedSongs);
    }
  }

  /**
   * Applies the changes made to a song, and updates the artist/album (or creates/deletes them) as needed.
   * @param originalSong The original song.
   * @param edited The edited song.
   */
  static async editSong(originalSong: Song, edited: Song) {

  }

  /**
   * Applies the changes made to an album, and updates the songs/artists (or creates/deletes them) as needed.
   * @param originalAlbum The original album.
   * @param edited The edited album.
   */
  static async editAlbum(originalAlbum: Album, edited: Album) {

  }

  /**
   * Deletes the provided songs from the device.
   * @param songNames The names of the songs to delete.
   */
  static async deleteSongsFromDevice(songNames: string[]) {
    // TODO: show popup to confirm if they really want to.
    // TODO: update relevant stores (recalc genres, albums, artists, remove from playlists)
    // ! Add logging
  }

  /**
   * Deletes the provided albums from the device.
   * @param albumNames The names of the albums to delete.
   */
  static async deleteAlbumsFromDevice(albumNames: string[]) {
    // TODO: show popup to confirm if they really want to.
    // TODO: update relevant stores (recalc genres, songs, artists, remove from playlists)
    // ! Add logging
  }

  /**
   * Deletes the provided artists from the device.
   * @param artistNames The names of the artists to delete.
   */
  static async deleteArtistsFromDevice(artistNames: string[]) {
    // TODO: show popup to confirm if they really want to.
    // TODO: update relevant stores
    // ! Add logging
  }

  /**
   * Deletes the provided playlists from the device.
   * @param playlistNames The names of the playlists to delete.
   */
  static async deletePlaylistsFromDevice(playlistNames: string[]) {
    const numPlaylistMessage = `${playlistNames.length} ${playlistNames.length === 1 ? "playlist" : "playlists"}`;

    DialogController.ask("This can't be undone!", `Are you sure you want to delete ${numPlaylistMessage}?`, "Yes", "No").then((shouldContinue) => {
      if (shouldContinue) {
        const playlistList = get(playlists);
        
        for (const name of playlistNames) {
          const index = playlistList.findIndex((playlist) => playlist.name === name);
          playlistList.splice(index, 1);
        }

        playlists.set(playlistList);

        LogController.log(`Deleted ${numPlaylistMessage}.`);
        get(showInfoSnackbar)({ message: numPlaylistMessage + " deleted", timeout: 1500 });
      }
    });
  }

  /**
   * Shares the provided songs.
   * @param songNames The names of the songs to share.
   */
  static async share(songNames: string[]) {
    // TODO: implement per platform.
    // ! Add logging
  }

  static async importPlaylist(playlistPath: string) {

  }

  static async exportPlaylist(playlist: Playlist) {

  }
}