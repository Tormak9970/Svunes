import { albums, history, nowPlayingList, playingSongId, playlists, queue, showErrorSnackbar, showInfoSnackbar, songs, songsMap } from "@stores/State";
import { get } from "svelte/store";
import { Album } from "../models/Album";
import { Song } from "../models/Song";
import { pluralize } from "../utils/Utils";
import { AppController } from "./AppController";
import { QueueController } from "./QueueController";
import { DialogController } from "./utils/DialogController";
import { LogController } from "./utils/LogController";
import { RustInterop } from "./utils/RustInterop";

/**
 * The controller for editing music, albums and artists.
 */
export class EditController {
  /**
   * Updates the provided song based on the edited fields.
   * @param original The original song.
   * @param editFields The edited fields.
   */
  private static editSongFields(original: Song, editFields: SongEditFields): void {
    for (const key of Object.keys(editFields)) {
      const songKey = key as keyof Song;
      let newValue = editFields[key as keyof SongEditFields];
      
      if (key === "releaseYear" && !newValue) newValue = -1;
      if (key === "title" && !newValue) newValue = original.fileName;

      // @ts-expect-error TS is warning about potentially assigning functions to editField's values, but because its hardcoded, we know that can't happen.
      original[songKey] = newValue;
    }
  }

  /**
   * Updates the provided album based on the edited fields.
   * @param original The original album.
   * @param editFields The edited fields.
   */
  private static editAlbumFields(original: Album, editFields: AlbumEditFields): void {
    for (const key of Object.keys(editFields)) {
      const songKey = key as keyof Album;
      // @ts-expect-error TS is warning about potentially assigning functions to editField's values, but because its hardcoded, we know that can't happen.
      original[songKey] = editFields[key as keyof AlbumEditFields];
    }
  }

  /**
   * Applies the changes made to a song, and updates the artist/album (or creates/deletes them) as needed.
   * @param original The original song.
   * @param editedFields The edited fields.
   */
  static async editSong(original: Song, editedFields: SongEditFields) {
    // if (changedAlbumFields.artPath) {
    //   const copiedPath = await this.copyAlbumImage(changedAlbumFields.artPath, original.name);
    //   changedAlbumFields.artPath = copiedPath;
    // }

    const changes: Record<string, SongEditFields> = {};
    changes[original.filePath] = editedFields;
    const success = await RustInterop.writeMusicFiles(changes);
    
    if (success) {
      this.editSongFields(original, editedFields);
      const songsList = get(songs);
      songs.set(songsList);
      
      AppController.loadAlbumsFromSongs(songsList);
      AppController.loadArtistsFromSongs(songsList);
      AppController.loadGenresFromSongs(songsList);

      get(showInfoSnackbar)({ message: "Finished writing changes" });
      LogController.log(`Finished writing edits to ${original.id}`);
    } else {
      get(showErrorSnackbar)({ message: "Failed to write all changes" });
    }
  }

  /**
   * Applies the changes made to an album, and updates the songs/artists (or creates/deletes them) as needed.
   * @param original The original album.
   * @param changedAlbumFields The edited album fields.
   */
  static async editAlbum(original: Album, changedAlbumFields: AlbumEditFields) {
    if (changedAlbumFields.artPath) {
      const copiedPath = await this.copyAlbumImage(changedAlbumFields.artPath, original.name);
      changedAlbumFields.artPath = copiedPath;
    }

    const songMap = get(songsMap);
    const changes: Record<string, SongEditFields> = {};

    for (const id of original.songIds) {
      const song = songMap[id];
      changes[song.filePath] = {
        "artPath": changedAlbumFields.artPath,
        "title": song.title,
        "album": changedAlbumFields.name,
        "composer": song.composer,
        "albumArtist": changedAlbumFields.artist,
        "artist": song.artist,
        "releaseYear": changedAlbumFields.releaseYear,
        "genre": changedAlbumFields.genre,
        "trackNumber": song.trackNumber
      };
    }
    
    const success = await RustInterop.writeMusicFiles(changes);

    if (success) {
      this.editAlbumFields(original, changedAlbumFields);
      await original.setBackgroundFromImage();
      
      const albumsList = get(albums);
      albums.set(albumsList);

      for (const id of original.songIds) {
        const song = songMap[id];
        const change = changes[song.filePath];

        song.artPath = change.artPath;
        song.albumArtist = change.albumArtist;
        song.releaseYear = change.releaseYear ?? -1;
        song.genre = change.genre;
      }

      const songsList = get(songs);
      songs.set(songsList);
      AppController.loadArtistsFromSongs(songsList);
      AppController.loadGenresFromSongs(songsList);

      get(showInfoSnackbar)({ message: "Finished writing changes" });
      LogController.log(`Finished writing edits to ${original.name}`);
    } else {
      get(showErrorSnackbar)({ message: "Failed to write all changes" });
    }
  }

  /**
   * Deletes the provided songs from the device.
   * @param songIds The ids of the songs to delete.
   */
  static async deleteSongsFromDevice(songIds: string[]) {
    const numSongsMessage = `${songIds.length} ${pluralize("song", songIds.length)}`;

    DialogController.ask("This can't be undone!", `Are you sure you want to delete ${numSongsMessage}?`, "Yes", "No").then(async (shouldContinue) => {
      if (shouldContinue) {
        const filePaths: string[] = [];
        const songList = get(songs);
        const playlistList = get(playlists);
        const songQueue = get(queue);
        const songHistory = get(history);
        const nowPlayingSongId = get(playingSongId);

        for (const id of songIds) {
          const index = songList.findIndex((song) => song.id === id);
          const [song] = songList.splice(index, 1);

          const queueIndex = songQueue.indexOf(id);
          if (queueIndex !== -1) songQueue.splice(queueIndex, 1);

          const historyIndex = songHistory.indexOf(id);
          if (historyIndex !== -1) songHistory.splice(historyIndex, 1);
          
          if (id === nowPlayingSongId) QueueController.skip();

          filePaths.push(song.filePath);
        }

        for (const playlist of playlistList) {
          for (const id of songIds) {
            const index = playlist.songIds.indexOf(id);

            if (index > -1) playlist.songIds.splice(index, 1);
          }
        }

        songs.set(songList);
        queue.set(songQueue);
        history.set(songHistory);
        
        const successPromise = RustInterop.deleteSongs(filePaths);

        AppController.loadAlbumsFromSongs(songList);
        AppController.loadArtistsFromSongs(songList);
        AppController.loadGenresFromSongs(songList);
        
        const success = await successPromise;

        if (success) {
          get(showInfoSnackbar)({ message: numSongsMessage + " deleted" });
        } else {
          get(showErrorSnackbar)({ message: "Failed to delete all selected songs."})
        }
      }
    });
  }

  /**
   * Deletes the provided albums from the device.
   * @param albumNames The names of the albums to delete.
   */
  static async deleteAlbumsFromDevice(albumNames: string[]) {
    const numSongsMessage = `${albumNames.length} ${pluralize("album", albumNames.length)}`;

    DialogController.ask("This can't be undone!", `Are you sure you want to delete ${numSongsMessage}?`, "Yes", "No").then(async (shouldContinue) => {
      if (shouldContinue) {
        const filePaths: string[] = [];
        const albumList = get(albums);
        const songList = get(songs);
        const playlistList = get(playlists);
        const songQueue = get(queue);
        const songHistory = get(history);
        const nowPlayingName = get(nowPlayingList);
        const nowPlayingSongId = get(playingSongId);

        let deletedSongIds: string[] = [];

        for (const albumName of albumNames) {
          const albumIndex = albumList.findIndex((album) => album.name === albumName);
          const [album] = albumList.splice(albumIndex, 1);
          
          for (const id of album.songIds) {
            const songIndex = songList.findIndex((song) => song.id === id);
            const [song] = songList.splice(songIndex, 1);

            const queueIndex = songQueue.indexOf(id);
            if (queueIndex !== -1) songQueue.splice(queueIndex, 1);
  
            const historyIndex = songHistory.indexOf(id);
            if (historyIndex !== -1) songHistory.splice(historyIndex, 1);

            if (id === nowPlayingSongId) QueueController.skip();

            filePaths.push(song.filePath);
            deletedSongIds.push(id);
          }

          if (albumName === nowPlayingName) nowPlayingList.set("");
        }

        for (const playlist of playlistList) {
          for (const id of deletedSongIds) {
            const index = playlist.songIds.indexOf(id);

            if (index > -1) playlist.songIds.splice(index, 1);
          }
        }

        albums.set(albumList);
        songs.set(songList);
        queue.set(songQueue);
        history.set(songHistory);
        
        const successPromise = RustInterop.deleteSongs(filePaths);

        AppController.loadAlbumsFromSongs(songList);
        AppController.loadArtistsFromSongs(songList);
        AppController.loadGenresFromSongs(songList);
        
        const success = await successPromise;

        if (success) {
          get(showInfoSnackbar)({ message: numSongsMessage + " deleted" });
        } else {
          get(showErrorSnackbar)({ message: "Failed to delete all selected albums."});
        }
      }
    });
  }

  /**
   * Deletes the provided playlists from the device.
   * @param playlistIds The ids of the playlists to delete.
   */
  static async deletePlaylistsFromDevice(playlistIds: string[]) {
    const numPlaylistMessage = `${playlistIds.length} ${pluralize("playlist", playlistIds.length)}`;

    DialogController.ask("This can't be undone!", `Are you sure you want to delete ${numPlaylistMessage}?`, "Yes", "No").then((shouldContinue) => {
      if (shouldContinue) {
        const playlistList = get(playlists);
        const nowPlayingName = get(nowPlayingList);
        
        for (const id of playlistIds) {
          const index = playlistList.findIndex((playlist) => playlist.id === id);
          playlistList.splice(index, 1);

          if (id === nowPlayingName) {
            nowPlayingList.set("");
          }
        }

        playlists.set(playlistList);

        LogController.log(`Deleted ${numPlaylistMessage}.`);
        get(showInfoSnackbar)({ message: numPlaylistMessage + " deleted" });
      }
    });
  }

  /**
   * Copies the provided image to the "albums" directory.
   * @param imagePath The image path to copy.
   * @param albumName The name of the album.
   * @returns The image path, or undefined if it was undefined.
   */
  static async copyAlbumImage(imagePath: string | undefined, albumName: string): Promise<string | undefined> {
    if (!imagePath) return undefined;
    
    const result = await RustInterop.copyAlbumsImage(imagePath, albumName);
    if (result === "") {
      get(showErrorSnackbar)({ message: "Invalid image selected", faster: true })
      return undefined;
    }

    return result;
  }

  /**
   * Copies the provided image to the "artists" directory.
   * @param imagePath The image path to copy.
   * @returns The image path, or undefined if it was undefined.
   */
  static async copyArtistImage(imagePath: string | undefined): Promise<string | undefined> {
    if (!imagePath) return undefined;

    const result = await RustInterop.copyArtistImage(imagePath);
    if (result === "") {
      get(showErrorSnackbar)({ message: "Invalid image selected", faster: true })
      return undefined;
    }

    return result;
  }

  /**
   * Copies the provided image to the "Playlists" directory.
   * @param imagePath The image path to copy.
   * @returns The image path, or undefined if it was undefined.
   */
  static async copyPlaylistImage(imagePath: string | undefined): Promise<string | undefined> {
    if (!imagePath) return undefined;

    const result = await RustInterop.copyPlaylistImage(imagePath);
    if (result === "") {
      get(showErrorSnackbar)({ message: "Invalid image selected", faster: true })
      return undefined;
    }

    return result;
  }
}