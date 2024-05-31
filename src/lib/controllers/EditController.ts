import { RustInterop } from "./utils/RustInterop";
import { albums, playlists, showErrorSnackbar, showInfoSnackbar, songs, songsMap } from "../../stores/State";
import { get } from "svelte/store";
import { Song } from "../models/Song";
import { Album } from "../models/Album";
import { LogController } from "./utils/LogController";
import { DialogController } from "./utils/DialogController";
import { AppController } from "./AppController";

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
      
      if (key === "releaseYear") newValue = -1;
      if (key === "title") newValue = original.key;

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
    const changes: Record<string, SongEditFields> = {};
    changes[original.key] = editedFields;
    const successPromise = RustInterop.writeMusicFiles(changes);
      
    this.editSongFields(original, editedFields);
    const songsList = get(songs);
    songs.set(songsList);
    
    AppController.loadAlbumsFromSongs(songsList);
    AppController.loadArtistsFromSongs(songsList);
    AppController.loadGenresFromSongs(songsList);

    const success = await successPromise;

    if (success) {
      get(showErrorSnackbar)({ message: "Finished writing changes", timeout: 2000 });
      LogController.log(`Finished writing edits to ${original.key}`);
    } else {
      get(showErrorSnackbar)({ message: "Failed to write all changes", timeout: 2000 });
    }
  }

  /**
   * Applies the changes made to an album, and updates the songs/artists (or creates/deletes them) as needed.
   * @param original The original album.
   * @param changedAlbumFields The edited album fields.
   */
  static async editAlbum(original: Album, changedAlbumFields: AlbumEditFields) {
    const songMap = get(songsMap);
    const changes: Record<string, SongEditFields> = {};

    this.editAlbumFields(original, changedAlbumFields);
    const albumsList = get(albums);
    albums.set(albumsList);

    for (const songKey of original.songKeys) {
      const song = songMap[songKey];
      const editFields: SongEditFields = {
        "artPath": changedAlbumFields.artPath,
        "title": song.title,
        "album": changedAlbumFields.name,
        "composer": song.composer,
        "albumArtist": changedAlbumFields.artist,
        "artist": song.artist,
        "releaseYear": changedAlbumFields.releaseYear,
        "genre": changedAlbumFields.genre,
        "trackNumber": song.trackNumber
      }

      song.artPath = editFields.artPath;
      song.albumArtist = editFields.albumArtist;
      song.releaseYear = editFields.releaseYear ?? -1;
      song.genre = editFields.genre;

      changes[song.key] = editFields;
    }

    const songsList = get(songs);
    songs.set(songsList);
    
    const successPromise = RustInterop.writeMusicFiles(changes);

    AppController.loadArtistsFromSongs(songsList);

    const success = await successPromise;

    if (success) {
      get(showErrorSnackbar)({ message: "Finished writing changes", timeout: 2000 });
      LogController.log(`Finished writing edits to ${original.name}`);
    } else {
      get(showErrorSnackbar)({ message: "Failed to write all changes", timeout: 2000 });
    }
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
   * Copies the provided image to the "albums" directory.
   * @param imagePath The image path to copy.
   * @returns The image path, or undefined if it was undefined.
   */
  static async copyAlbumImage(imagePath: string | undefined): Promise<string | undefined> {
    if (!imagePath) return undefined;
    return await RustInterop.copyArtistImage(imagePath);
  }

  /**
   * Copies the provided image to the "artists" directory.
   * @param imagePath The image path to copy.
   * @returns The image path, or undefined if it was undefined.
   */
  static async copyArtistImage(imagePath: string | undefined): Promise<string | undefined> {
    if (!imagePath) return undefined;
    return await RustInterop.copyArtistImage(imagePath);
  }
}