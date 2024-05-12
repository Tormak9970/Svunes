import { showEditMusicFolders } from "../../stores/Overlays";
import { RustInterop } from "./RustInterop";
import { albums, artists, genres, musicDirectories, nowPlayingListName, nowPlayingType, queue, showMiniPlayer, songName, songProgress, songs } from "../../stores/State";
import { get, type Unsubscriber } from "svelte/store";
import { Song } from "../models/Song";
import { Album } from "../models/Album";
import { SettingsController } from "./SettingsController";
import { LogController } from "./LogController";
import { Genre } from "../models/Genre";
import { Artist } from "../models/Artist";

/**
 * The core app controller.
 */
export class AppController {
  private static musicFoldersSub: Unsubscriber;
  /**
   * Initializes the app.
   */
  static async init() {
    this.musicFoldersSub = musicDirectories.subscribe((folders) => {
      this.loadSongs(folders);
    });
  }

  /**
   * Function to run on cleanup.
   */
  static destroy() {
    if (this.musicFoldersSub) this.musicFoldersSub();
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
    const albumMap = new Map<string, Album>();

    const albumsList = get(albums);

    for (const song of songs) {
      if (!albumMap.get(song.album)) {
        const listAlbum = albumsList.find((a) => a.name === song.album);
        const album = new Album(song.album, song.albumPath, song.releaseYear, listAlbum?.lastPlayedOn);
        album.songNames.push(song.title);
        
        if (song.artist) album.artists.add(song.artist);

        albumMap.set(album.name, album);
      } else {
        const album = albumMap.get(song.album)!;
        album.songNames.push(song.title);
        
        if (song.artist) album.artists.add(song.artist);
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
    const artistMap = new Map<string, Artist>();

    for (const song of songs) {
      if (song.artist) {
        if (!artistMap.get(song.artist)) {
          const artist = new Artist(song.artist);
          artist.songNames.push(song.title);
          artist.albumNames.add(song.album);
  
          artistMap.set(song.artist, artist);
        } else {
          const artist = artistMap.get(song.artist)!;
          artist.songNames.push(song.title);
          artist.albumNames.add(song.album);
        }
      }
    }

    const artistList = Array.from(artistMap.values());
    artists.set(artistList);

    LogController.log(`Loaded ${artistList.length} artists.`);
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
        const genre = new Genre(songGenre, song.albumPath);
        genre.songNames.push(song.title);

        genreMap.set(songGenre, genre);
      } else {
        const genre = genreMap.get(songGenre)!;
        genre.songNames.push(song.title);
      }
    }

    const genreList = Array.from(genreMap.values());
    genres.set(genreList);

    LogController.log(`Loaded ${genreList.length} genres.`);
  }

  /**
   * Reads songs from the provided folders.
   * @param musicFolders The folders to read music from.
   */
  static async loadSongs(musicFolders: string[]) {
    if (musicFolders.length === 0) {
      showEditMusicFolders.set(true);
    } else {
      const songsJson = await RustInterop.readMusicFolders(musicFolders);
      const loadedSongs: Song[] = songsJson.map((json) => Song.fromJSON(json));
      
      if (SettingsController.getSetting<number>("cache.numSongs") !== loadedSongs.length) this.resetNowPlaying();
      songs.set(loadedSongs);
      LogController.log(`Loaded ${loadedSongs.length} songs.`);

      this.loadAlbumsFromSongs(loadedSongs);
      this.loadGenresFromSongs(loadedSongs);
      this.loadArtistsFromSongs(loadedSongs);
    }
  }
}