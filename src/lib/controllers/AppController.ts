import { Album, Artist, Genre, Playlist, Song } from "@models";
import { t } from "@stores/Locale";
import { showEditMusicFolders } from "@stores/Modals";
import { showMiniPlayer, showNowPlaying } from "@stores/Overlays";
import { albums, artists, blacklistedFolders, genres, isLoading, musicDirectories, playingSongId, playlists, showErrorSnackbar, showInfoSnackbar, songs, songsMap } from "@stores/State";
import { window } from "@tauri-apps/api";
import type { UnlistenFn } from "@tauri-apps/api/event";
import * as fs from "@tauri-apps/plugin-fs";
import type { AlbumMetadata, ArtistMetadata, SongMetadata } from "@types";
import { debounce, getAllArtistNames } from "@utils";
import { get, type Unsubscriber } from "svelte/store";
import { PlaybackController } from "./PlaybackController";
import { DialogController } from "./utils/DialogController";
import { LogController } from "./utils/LogController";
import { RustInterop } from "./utils/RustInterop";
import { SettingsController } from "./utils/SettingsController";

/**
 * The core app controller.
 */
export class AppController {
  private static musicFoldersSub: Unsubscriber;
  private static blacklistFoldersSub: Unsubscriber;
  private static musicFolderUpdateUnsub: UnlistenFn;
  private static oldBlacklist: string[] = [];

  /**
   * Checks if the app has an internet connection.
   */
  static isOnline() {
    return navigator.onLine;
  }

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

    const translate = get(t);

    const handler = debounce(() => {
      console.log("detected folder change!");

      DialogController.ask(
        translate("CHANGES_DETECTED_TITLE"),
        translate("RESTART_WITH_CHANGES_MESSAGE"),
        translate("YES_ACTION"),
        translate("NO_ACTION")
      ).then((result) => {
        if (result) {
          this.loadSongs(get(musicDirectories), get(blacklistedFolders));
        }
      });
    }, 1000);

    this.musicFolderUpdateUnsub = await window.getCurrentWindow().listen("music_folder_update", handler);
  }

  /**
   * Function to run on cleanup.
   */
  static destroy() {
    if (this.musicFoldersSub) this.musicFoldersSub();
    if (this.blacklistFoldersSub) this.blacklistFoldersSub();
    if (this.musicFolderUpdateUnsub) this.musicFolderUpdateUnsub();
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

    for (const album of newAlbumsList) {
      if (!album._albumArtist && album.albumArtist) {
        for (const id of album.songIds) {
          songs.find((song) => song.id === id)!.albumArtist = album.albumArtist;
        }
      }
    }

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
          song.dateAdded = metadata.dateAdded ?? (new Date()).toISOString();
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

      this.loadAlbumsFromSongs(loadedSongs);

      songs.set(loadedSongs);
      LogController.log(`Loaded ${loadedSongs.length} songs.`);
      
      const songId = SettingsController.getSetting<string>("cache.playingSongId");
      if (songId !== "") playingSongId.set(songId);

      this.loadGenresFromSongs(loadedSongs);
      this.loadArtistsFromSongs(loadedSongs);
    }
  }

  /**
   * Shares the provided songs.
   * @param songIds The ids of the songs to share.
   */
  static async share(songIds: string[]) {
    get(showInfoSnackbar)({ message: "Sharing is not implemented yet" });
    // const songMap = get(songsMap);

    // const files: File[] = [];

    // for (const id of songIds) {
    //   const song = songMap[id];

    //   const data = await fs.readBinaryFile(song.filePath);

    //   const type = (await path.extname(song.filePath)).toLowerCase();
    //   const file = new File([data], `${song.fileName}.${type}`, {
    //     type: type === "mp3" ? "audio/mpeg" : "audio/flac",
    //   });
      
    //   files.push(file);
    // }

    // const data = {
    //   files: files,
    //   title: 'My title',
    //   text: 'My text',
    // }

    // if (navigator.canShare(data)) {
    //   await navigator.share(data);
    //   get(showInfoSnackbar)({ message: "Shared songs" });
    //   LogController.log(`Shared ${files.length} files.`);
    // } else {
    //   get(showErrorSnackbar)({ message: "Failed to share songs" });
    //   LogController.error(`Failed to share ${files.length} files.`);
    // }
  }

  /**
   * Imports a playlist from the provided path.
   * @param playlistPath The path of the playlist to import.
   */
  static async importPlaylist(playlistPath: string) {
    const contents = await fs.readTextFile(playlistPath);
    if (contents === "") {
      get(showInfoSnackbar)({ message: get(t)("PLAYLIST_EMPTY_MESSAGE") });
      LogController.error("Playlist JSON was empty.");
      return;
    }

    let playlistJson: any = JSON.parse(contents);
    if (playlistJson.FILE_SIG_DO_NOT_EDIT !== "dev.travislane.svunes") {
      get(showErrorSnackbar)({ message: get(t)("INVALID_PLAYLIST_MESSAGE") });
      LogController.error("Playlist did not contain the FILE_SIG.");
      return;
    }
    
    const playlist = Playlist.fromJSON(playlistJson);

    const playlistList = get(playlists);

    if (playlistList.some((p) => p.name === playlist.name)) {
      get(showErrorSnackbar)({ message: get(t)("PLAYLIST_EXISTS_MESSAGE") });
      LogController.error(`A playlist with name ${playlist.name} already exists.`);
      return;
    }
    
    const songsList = get(songs);
    const songIds: string[] = [];

    for (const fileName of playlistJson.songFileNames) {
      const song = songsList.find((song) => song.fileName === fileName);
      if (song) songIds.push(song.id);
    }

    playlist.songIds = songIds;

    playlistList.push(playlist);

    playlists.set([ ...playlistList ]);

    get(showInfoSnackbar)({ message: get(t)("SUCCESS_MESSAGE") });
    LogController.log(`Successfully imported playlist ${playlist.name}`);
  }

  /**
   * Exports the provided playlist.
   * @param playlistPath The path of the playlist to import.
   * @param playlist The playlist to export.
   */
  static async exportPlaylist(playlistPath: string, playlist: Playlist) {
    const songMap = get(songsMap);
    const playlistJSON = JSON.parse(JSON.stringify(playlist));
    playlistJSON.FILE_SIG_DO_NOT_EDIT = "dev.travislane.svunes";

    playlistJSON.songFileNames = playlist.songIds.map((id) => songMap[id].fileName);

    await fs.writeTextFile(playlistPath, JSON.stringify(playlistJSON));

    LogController.log(`Exported ${playlist.name}.`);
  }
}