import { showEditMusicFolders } from "@stores/Modals";
import { showMiniPlayer, showNowPlaying } from "@stores/Overlays";
import { albums, artists, blacklistedFolders, genres, isLoading, musicDirectories, playingSongId, songs } from "@stores/State";
import { get, type Unsubscriber } from "svelte/store";
import type { AlbumMetadata, ArtistMetadata, SongMetadata } from "../../types/Settings";
import { Album } from "../models/Album";
import { Artist } from "../models/Artist";
import { Genre } from "../models/Genre";
import type { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { getAllArtistNames } from "../utils/Utils";
import { PlaybackController } from "./PlaybackController";
import { SettingsController } from "./SettingsController";
import { LogController } from "./utils/LogController";
import { RustInterop } from "./utils/RustInterop";

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
   * Generates all of the albums from the loaded songs.
   * @param songs The loaded songs.
   */
  static loadAlbumsFromSongs(songs: Song[]) {
    const albumsMetadataMap = SettingsController.getSetting<Record<string, AlbumMetadata>>("cache.albumsMetadata");
    const albumMap = new Map<string, Album>();

    for (const song of songs) {
      if (song.album) {
        if (!albumMap.get(song.album)) {
          const metadata = albumsMetadataMap[song.album];
          const album = new Album(song.album, song.artPath, song.albumArtist, song.releaseYear, song.genre, metadata?.lastPlayedOn, metadata?.numTimesPlayed);
          album.songIds.push(song.id);
          
          if (song.artist) album.artists.add(song.artist);
  
          albumMap.set(album.name, album);
        } else {
          const album = albumMap.get(song.album)!;
          album.songIds.push(song.id);
          
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
  static loadArtistsFromSongs(songs: Song[]) {
    const artistsMetadataMap = SettingsController.getSetting<Record<string, ArtistMetadata>>("cache.artistsMetadata");
    const cachedSongId = SettingsController.getSetting<string>("cache.playingSongId");
    const artistMap = new Map<string, Artist>();

    for (const song of songs) {
      if (song.artist) {
        for (const artistName of getAllArtistNames(song.artist)) {
          if (!artistMap.get(artistName)) {
            const metadata = artistsMetadataMap[artistName];
            const artist = new Artist(artistName, metadata?.imagePath ?? song.artPath);
            artist.songIds.push(song.id);
            
            if (song.album && song.albumArtist?.includes(artistName)) artist.albumNames.add(song.album);
            if (song.genre) artist.genres.add(song.genre);
    
            artistMap.set(artistName, artist);
          } else {
            const artist = artistMap.get(artistName)!;
            artist.songIds.push(song.id);
  
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

      console.log("cachedSongId:", cachedSongId);
      playingSongId.set(cachedSongId);
      if (cachedSongId !== "") {
        showNowPlaying.set(true);
        showMiniPlayer.set(true);
      }

      SettingsController.registerSubs();
    });
  }

  /**
   * Generates all of the genres from the loaded songs.
   * @param songs The loaded songs.
   */
  static loadGenresFromSongs(songs: Song[]) {
    const genreMap = new Map<string, Genre>();

    for (const song of songs) {
      const songGenre = song.genre ?? "Other";

      if (!genreMap.get(songGenre)) {
        const genre = new Genre(songGenre, song.artPath);
        genre.songIds.push(song.id);

        if (song.artist) {
          for (const artist of getAllArtistNames(song.artist)) {
            genre.artists.add(artist);
          }
        }

        genreMap.set(songGenre, genre);
      } else {
        const genre = genreMap.get(songGenre)!;
        genre.songIds.push(song.id);

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
        const metadata = songsMetadataMap[song.id];
        
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
      
      if (SettingsController.getSetting<number>("cache.numSongs") !== loadedSongs.length) PlaybackController.resetNowPlaying();

      songs.set(loadedSongs);
      LogController.log(`Loaded ${loadedSongs.length} songs.`);
      
      const songId = SettingsController.getSetting<string>("cache.playingSongId");
      if (songId !== "") playingSongId.set(songId);

      this.loadAlbumsFromSongs(loadedSongs);
      this.loadGenresFromSongs(loadedSongs);
      this.loadArtistsFromSongs(loadedSongs);
    }
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