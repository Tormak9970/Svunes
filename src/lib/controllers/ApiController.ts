import { albumResults, apiSearchCanceled, imageResults, onAlbumInfoResultsDone, onImageResultsDone, showAlbumInfoResults, showImageResults, showSearchingApi } from "@stores/Modals";
import { fs, path } from "@tauri-apps/api";
import { get, type Unsubscriber } from "svelte/store";
import { showErrorSnackbar } from "../../stores/State";
import type { ReleaseGroup } from "../../types/MusicBrainz";
import { CoverArtApi } from "../models/CoverArtApi";
import { MusicBrainzApi } from "../models/MusicBrainzApi";
import { compareStrings } from "../utils/Utils";
import { LogController } from "./utils/LogController";
import { RustInterop } from "./utils/RustInterop";

type Resolver<T> = (value: T | PromiseLike<T>) => void;

export type AlbumResult = {
  releaseId: string;
  title: string;
  artist?: string;
  genres: string[];
  releaseYear?: string;
}

export type SelectedAlbum = {
  title: string;
  artist?: string;
  genre?: string;
  releaseYear?: string;
}

export type SongResult = {
  title: string;
  album?: string;
  artist?: string;
  albumArtist?: string;
  composer?: string;
  genres: string[];
  trackNumber?: string;
  releaseYear?: string;
}

export type SelectedSong = {
  title: string;
  album?: string;
  artist?: string;
  albumArtist?: string;
  composer?: string;
  genre?: string;
  trackNumber?: string;
  releaseYear?: string;
}

/**
 * Handles interacting with the external apis used by the app
 */
export class ApiController {
  private static readonly TIMEOUT = 5000;
  private static readonly USER_AGENT = `dev.tormak.tunistic/${APP_VERSION} ( https://tunistic.org )`;

  private static coverCacheDir: string;

  private static musicBrainzApiModel: MusicBrainzApi;
  private static coverArtApiModel: CoverArtApi;

  private static albumNameReleaseIdsMap: Record<string, string[]> = {};

  private static albumImageCache: Record<string, string[]> = {};
  private static albumInfoCache: Record<string, AlbumResult[]> = {};


  /**
   * Initializes the Api controller.
   */
  static async init() {
    this.musicBrainzApiModel = new MusicBrainzApi(this.USER_AGENT, this.TIMEOUT);
    this.coverArtApiModel = new CoverArtApi(this.USER_AGENT, this.TIMEOUT);
    
    const appCacheDir = await path.appCacheDir();
    this.coverCacheDir = await path.join(appCacheDir, "downloaded-covers");
    
    try {
      if (!(await fs.exists(this.coverCacheDir))) await fs.createDir(this.coverCacheDir);
    } catch(e: any) {
      LogController.error(e.message);
      get(showErrorSnackbar)({ message: "Unable to create albums cache" });
    }
  }

  /**
   * Empties the covers cache.
   * ? Logging complete.
   */
  private static async invalidateCache(): Promise<void> {
    // LogController.log("Clearing cache...");
    await fs.removeDir(this.coverCacheDir, { recursive: true });
    LogController.log("Cleared cache.");
  }
  
  /**
   * Function to run when the app closes.
   * ? Logging complete.
   */
  static async destroy() {
    await this.invalidateCache();
  }

  /**
   * Downloads an image from a url, and returns the resulting path.
   * @param imageUrl The url of the image to get.
   * @returns The resulting path, or null if the download failed.
   */
  static async getLocalImagePath(imageUrl: string): Promise<string | null> {
    const showError = get(showErrorSnackbar);
    
    const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    const localImagePath = await path.join(this.coverCacheDir, fileName);

    if (await fs.exists(localImagePath)) {
      LogController.log("Cache found. Fetching album cover from local file system.");
      return localImagePath;
    }

    const status = await RustInterop.downloadImage(imageUrl, localImagePath, this.TIMEOUT);

    switch (status) {
      case "success":
        LogController.log(`Request for ${imageUrl} succeeded.`);
        return localImagePath;
      case "timedOut":
        showError({ message: "Image download timed out" });
        LogController.warn(`Request for ${imageUrl} timed out after ${this.TIMEOUT / 1000} seconds.`);
      case "failed":
        showError({ message: "Failed to download image" });
        LogController.warn(`Request for ${imageUrl} failed.`);
    }
    
    return null;
  }

  /**
   * ? This looks a little confusing but has been verified to work via testing.
   * Creates a promise that cancels when apiSearchCanceled is set to `true`.
   * @param callback The promise callback.
   * @param canceledValue The value to use if the promise is canceled.
   */
  private static cancelablePromise<T>(callback: (resolve: Resolver<T>) => Promise<void>, canceledValue: T): Promise<T> {
    return new Promise<T>(async (resolve) => {
      let cancelSub: Unsubscriber;

      const wrappedResolver = (value: T | PromiseLike<T>) => {
        if (cancelSub) cancelSub();
        resolve(value);
      }

      cancelSub = apiSearchCanceled.subscribe((canceled: boolean) => {
        if (canceled) wrappedResolver(canceledValue);
      });

      await callback(wrappedResolver);
    });
  }

  /**
   * Get the album's cover from the api.
   * @param albumName The name of the album.
   */
  static async getPictureForAlbum(albumName: string): Promise<string | null> {
    return this.cancelablePromise<string | null>(async (resolve) => {
      let results = this.albumImageCache[albumName];

      if (!results || results.length === 0) {
        let releaseIds = this.albumNameReleaseIdsMap[albumName];
        if (!releaseIds) {
          releaseIds = await this.musicBrainzApiModel.getReleaseIdForAlbum(albumName);
          this.albumNameReleaseIdsMap[albumName] = releaseIds;
        }

        results = [];
        for (const releaseId of releaseIds) {
          const images = await this.coverArtApiModel.getAlbumCovers(releaseId);
          if (images) results.push(...images);
        }

        this.albumImageCache[albumName] = results;
      }
      
      showSearchingApi.set(false);

      if (results.length > 0) {
        imageResults.set(results);
        onImageResultsDone.set((path: string | null) => resolve(path));
        showImageResults.set(true);
      }
    }, null);
  }
  
  /**
   * Gets releases for an album from a list of release-groups.
   * @param albumName The name of the albums.
   * @param releaseGroups The release-groups to check.
   * @returns The releases.
   */
  private static async getReleasesFromReleaseGroups(albumName: string, releaseGroups: ReleaseGroup[]): Promise<AlbumResult[]> {
    const releases: AlbumResult[] = [];

    let closest = releaseGroups[0];
    let highestSimilarity = compareStrings(albumName, closest.title);

    for (let i = 1; i < releaseGroups.length; i++) {
      const album = releaseGroups[i];
      const similarity = compareStrings(albumName, album.title);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        closest = album;
      }
    }

    for (const release of closest.releases) {
      const releaseAlbumInfo = await this.musicBrainzApiModel.getReleaseInfo(release.id);
      if (releaseAlbumInfo) releases.push(releaseAlbumInfo);
    }

    return releases;
  }

  /**
   * Get the album's info from the api.
   * @param albumName The name of the album.
   */
  static async getInfoForAlbum(albumName: string): Promise<SelectedAlbum | null> {
    return this.cancelablePromise<SelectedAlbum | null>(async (resolve) => {
      let results = this.albumInfoCache[albumName];

      if (!results || results.length === 0) {
        const releaseGroups = await this.musicBrainzApiModel.getAlbumInfo(albumName);

        const releases = await this.getReleasesFromReleaseGroups(albumName, releaseGroups);

        results = releases;
        this.albumNameReleaseIdsMap[albumName] = results.map((result) => result.releaseId);
        this.albumInfoCache[albumName] = results;
      }
      
      showSearchingApi.set(false);

      if (results.length > 0) {
        albumResults.set(results);
        onAlbumInfoResultsDone.set((selected: SelectedAlbum | null) => resolve(selected));
        showAlbumInfoResults.set(true);
      }
    }, null);
  }
}