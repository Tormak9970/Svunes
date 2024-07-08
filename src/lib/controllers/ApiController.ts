import { apiSearchCanceled } from "@stores/Modals";
import type { Unsubscriber } from "svelte/store";
import { CoverArtApi } from "../models/CoverArtApi";
import { MusicBrainzApi } from "../models/MusicBrainzApi";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type Resolver<T> = (value: T | PromiseLike<T>) => void;

export type AlbumResult = {
  artist?: string;
  genre?: string;
  releaseYear?: string;
}

export type SongResult = {
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

  private static musicBrainzApiModel: MusicBrainzApi;
  private static coverArtApiModel: CoverArtApi;

  private static albumIdReleaseIdMap: Record<string, string>;

  private static songImageCache: Record<string, string[]>;
  private static songInfoCache: Record<string, SongResult[]>;

  private static albumImageCache: Record<string, string[]>;
  private static albumInfoCache: Record<string, AlbumResult[]>;


  static init() {
    this.musicBrainzApiModel = new MusicBrainzApi(this.USER_AGENT, this.TIMEOUT);
    this.coverArtApiModel = new CoverArtApi(this.USER_AGENT, this.TIMEOUT);
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
      await sleep(this.TIMEOUT);
      resolve(null);
    }, null);
  }

  /**
   * Get the song's album cover from the api.
   * @param songId The id of the song to get.
   */
  static async getPictureForSong(songId: string): Promise<string | null> {
    return this.cancelablePromise<string | null>(async (resolve) => {
      await sleep(this.TIMEOUT);
      resolve(null);
    }, null);
  }
  

  /**
   * Get the album's info from the api.
   * @param albumName The name of the album.
   */
  static async getInfoForAlbum(albumName: string): Promise<AlbumResult | null> {
    return this.cancelablePromise<AlbumResult | null>(async (resolve) => {
      await sleep(this.TIMEOUT);
      resolve(null);
      // will search release and recording
    }, null);
  }

  /**
   * Get the song's info from the api.
   * @param songId The id of the song to get.
   */
  static async getInfoForSong(songId: string): Promise<SongResult | null> {
    return this.cancelablePromise<SongResult | null>(async (resolve) => {
      await sleep(this.TIMEOUT);
      resolve(null);
      // will search release group
      // * filter type: album, single, ep
    }, null);
  }
}