import { CoverArtApi, MusicBrainzApi } from "@models";
import { t } from "@stores/Locale";
import { albumCovers, albumInfos, apiSearchCanceled, availableReleaseGroups, onAlbumInfoDone, onPickCoverDone, selectedReleaseGroupId, showPickAlbumCover, showPickAlbumInfo, showSearchingApi } from "@stores/Modals";
import { showErrorSnackbar } from "@stores/State";
import { path } from "@tauri-apps/api";
import { exists, mkdir, remove } from "@tauri-apps/plugin-fs";
import type { ReleaseGroup } from "@types";
import { compareStrings } from "@utils";
import { get, type Unsubscriber } from "svelte/store";
import { LogController } from "./utils/LogController";
import { RustInterop } from "./utils/RustInterop";

type Resolver<T> = (value: T | PromiseLike<T>) => void;

export type AlbumInfo = {
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

// ! Album Info Process
// albumName -> releaseGroups
  // ? Store so user can select desired releaseGroup
  // * cache these

  // releaseGroupId -> releaseIds -> releaseInfo
    // ? Store so user can select desired release info
    // * cache these


// ! Album Cover Process
// albumName -> releaseGroups
  // ? Store so user can select desired releaseGroup
  // * cache these

  // releaseGroupId -> releaseIds -> releaseCovers
    // ? Store so user can select desired release cover
    // * cache these

/**
 * Handles interacting with the external apis used by the app
 */
export class ApiController {
  private static readonly TIMEOUT = 5000;
  private static readonly USER_AGENT = `dev.travislane.svunes/${APP_VERSION} ( https://svunes.org )`;

  private static coverCacheDir: string;

  private static musicBrainzApiModel: MusicBrainzApi;
  private static coverArtApiModel: CoverArtApi;


  private static albumNameGroupsMap: Record<string, ReleaseGroup[]> = {};
  private static groupIdCoversMap: Record<string, string[]> = {};
  private static groupIdInfoMap: Record<string, AlbumInfo[]> = {};


  /**
   * Initializes the Api controller.
   */
  static async init() {
    this.musicBrainzApiModel = new MusicBrainzApi(this.USER_AGENT, this.TIMEOUT);
    this.coverArtApiModel = new CoverArtApi(this.USER_AGENT, this.TIMEOUT);
    
    const appCacheDir = await path.appCacheDir();
    this.coverCacheDir = await path.join(appCacheDir, "downloaded-covers");
    
    try {
      const cacheDirExists = await exists(this.coverCacheDir);
      if (!cacheDirExists) await mkdir(this.coverCacheDir);
    } catch(e: any) {
      LogController.error(e.message);
      get(showErrorSnackbar)({ message: get(t)("ALBUM_CACHE_CREATION_FAILED_MESSAGE") });
    }
  }

  /**
   * Empties the covers cache.
   * ? Logging complete.
   */
  private static async invalidateCache(): Promise<void> {
    await remove(this.coverCacheDir, { recursive: true });
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

    if (await exists(localImagePath)) {
      LogController.log("Cache found. Fetching album cover from local file system.");
      return localImagePath;
    }

    const status = await RustInterop.downloadImage(imageUrl, localImagePath, this.TIMEOUT);

    switch (status) {
      case "success":
        LogController.log(`Request for ${imageUrl} succeeded.`);
        return localImagePath;
      case "timedOut":
        showError({ message: get(t)("IMAGE_DOWNLOAD_TIMEOUT_MESSAGE") });
        LogController.warn(`Request for ${imageUrl} timed out after ${this.TIMEOUT / 1000} seconds.`);
      case "failed":
        showError({ message: get(t)("IMAGE_DOWNLOAD_FAILED_MESSAGE") });
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
   * Gets the release group with a title closest to the album name.
   * @param albumName The name of the album.
   * @param releaseGroups The release groups to check.
   */
  private static getClosestRelease(albumName: string, releaseGroups: ReleaseGroup[]): ReleaseGroup {
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

    return closest;
  }
  
  /**
   * Gets the album covers from a release group
   * @param releaseGroup The release-group to get releases for.
   */
  static async getCoversForReleaseGroup(releaseGroup: ReleaseGroup): Promise<string[]> {
    let covers = this.groupIdCoversMap[releaseGroup.id];

    if (!covers || covers.length === 0) {
      covers = [];

      for (const release of releaseGroup.releases) {
        const images = await this.coverArtApiModel.getAlbumCovers(release.id);
        if (images) covers.push(...images);
      }

      this.groupIdCoversMap[releaseGroup.id] = covers;
    }

    return covers;
  }

  /**
   * Get the album's cover from the api.
   * @param albumName The name of the album.
   */
  static async getPictureForAlbum(albumName: string): Promise<string | null> {
    return this.cancelablePromise<string | null>(async (resolve) => {
      let releaseGroups = this.albumNameGroupsMap[albumName];

      if (!releaseGroups) {
        releaseGroups = await this.musicBrainzApiModel.getReleaseGroups(albumName);
        this.albumNameGroupsMap[albumName] = releaseGroups;
      }

      const closest = this.getClosestRelease(albumName, releaseGroups);
      const covers = await this.getCoversForReleaseGroup(closest);
      
      showSearchingApi.set(false);

      if (covers.length > 0) {
        availableReleaseGroups.set(releaseGroups);
        selectedReleaseGroupId.set(closest.id);
        albumCovers.set(covers);
        onPickCoverDone.set((path: string | null) => resolve(path));
        showPickAlbumCover.set(true);
      }
    }, null);
  }

  /**
   * Gets releases for an album from a release group
   * @param releaseGroup The release-group to get releases for.
   */
  static async getReleasesForReleaseGroup(releaseGroup: ReleaseGroup): Promise<AlbumInfo[]> {
    let releases: AlbumInfo[] = this.groupIdInfoMap[releaseGroup.id];

    if (!releases) {
      releases = [];

      for (const release of releaseGroup.releases) {
        const releaseAlbumInfo = await this.musicBrainzApiModel.getReleaseInfo(release.id);
        if (releaseAlbumInfo) releases.push(releaseAlbumInfo);
      }

      this.groupIdInfoMap[releaseGroup.id] = releases;
    }

    return releases;
  }

  /**
   * Get the album's info from the api.
   * @param albumName The name of the album.
   */
  static async getInfoForAlbum(albumName: string): Promise<SelectedAlbum | null> {
    return this.cancelablePromise<SelectedAlbum | null>(async (resolve) => {
      let releaseGroups = this.albumNameGroupsMap[albumName];

      if (!releaseGroups) {
        releaseGroups = await this.musicBrainzApiModel.getReleaseGroups(albumName);
        this.albumNameGroupsMap[albumName] = releaseGroups;
      }

      const closest = this.getClosestRelease(albumName, releaseGroups);
      const releases = await this.getReleasesForReleaseGroup(closest);
      
      showSearchingApi.set(false);

      if (releases.length > 0) {
        availableReleaseGroups.set(releaseGroups);
        selectedReleaseGroupId.set(closest.id);
        albumInfos.set(releases);
        onAlbumInfoDone.set((selected: SelectedAlbum | null) => resolve(selected));
        showPickAlbumInfo.set(true);
      }
    }, null);
  }
}