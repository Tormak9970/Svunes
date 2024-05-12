import { showEditMusicFolders } from "../../stores/Overlays";
import { RustInterop } from "./RustInterop";
import { albums, musicDirectories, nowPlayingListName, nowPlayingType, queue, showMiniPlayer, songName, songProgress, songs } from "../../stores/State";
import { get, type Unsubscriber } from "svelte/store";
import { Song } from "../models/Song";
import { Album } from "../models/Album";
import { SettingsController } from "./SettingsController";
import { LogController } from "./LogController";

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
        album.trackCount++;
        
        if (song.artist) album.artists.add(song.artist);

        albumMap.set(album.name, album);
      } else {
        const album = albumMap.get(song.album)!;
        album.songNames.push(song.title);
        album.trackCount++;
        
        if (song.artist) album.artists.add(song.artist);
      }
    }

    const newAlbumsList = Array.from(albumMap.values());
    albums.set(newAlbumsList);
    
    LogController.log(`Loaded ${newAlbumsList.length} albums.`);
    
    this.loadArtistsFromSongs(newAlbumsList);
    this.loadGenresFromSongs(newAlbumsList);
  }

  /**
   * Generates all of the artists from the loaded albums.
   * @param albums The loaded albums.
   */
  private static loadArtistsFromSongs(albums: Album[]) {
    
    // LogController.log(`Loaded ${newAlbumsList.length} artists.`);
  }

  /**
   * Generates all of the genres from the loaded albums.
   * @param albums The loaded albums.
   */
  private static loadGenresFromSongs(albums: Album[]) {
    
    // LogController.log(`Loaded ${newAlbumsList.length} genres.`);
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
    }
  }
}