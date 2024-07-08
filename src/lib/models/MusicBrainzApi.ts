import { http } from "@tauri-apps/api";
import { ResponseType, type HttpVerb } from "@tauri-apps/api/http";
import type { RecordingResponse, Release, ReleaseGroupResponse } from "../../types/MusicBrainz";
import { LogController } from "../controllers/utils/LogController";
import { getGenre } from "../utils/Utils";
import { RequestError } from "./TauriResponse";

export type MBAlbumInfo = {
  albumArtist: string | undefined;
  releaseYear: string | undefined;
  genre: string | undefined;
  trackCount: string | undefined;
}

export type MBSongInfo = {
  album: string | undefined;
  artist: string | undefined;
  albumArtist: string | undefined;
  composer: string | undefined;
  genre: string | undefined;
  trackNumber: string | undefined;
  releaseYear: string | undefined;
}

/**
 * A wrapper for the MusicBrainz API.
 */
export class MusicBrainzApi {
  private readonly BASE_URL = "http://beta.musicbrainz.org/ws/2/";
  private readonly extraOptions = "fmt=json&limit=10";

  private userAgent: string;
  private timeout: number;


  constructor(userAgent: string, timeout: number) {
    this.userAgent = userAgent;
    this.timeout = timeout;
  }

  /**
   * Makes a request and returns the result.
   * @param method The method of the request.
   * @param url The url endpoint.
   */
  private async makeRequest<T>(method: HttpVerb, url: string): Promise<T | Error> {
    const options = {
      timeout: this.timeout,
      method: method,
      responseType: ResponseType.JSON,
      headers: {
        'User-Agent': this.userAgent
      }
    }

    let response = await http.fetch<any>(`${this.BASE_URL}${url}`, options);

    if (response.ok) {
      if (response?.data.success) {
        return response.data.data ?? response.data.success;
      } else {
        throw new RequestError(response.data?.errors?.join(", ") ?? "Unknown MusicBrainz error.", response);
      }
    } else {
      throw new RequestError(response.data?.errors?.join(", ") ?? "MusicBrainz error.", response);
    }
  }

  /**
   * Gets information about a release given its id.
   * @param releaseId The id of the release to get.
   * @returns 
   */
  private async getReleaseInfo(releaseId: string): Promise<MBAlbumInfo | undefined> {
    try {
      const results = await this.makeRequest<Release>("GET", `release/${releaseId}?${this.extraOptions}&inc=tags%2Bartist-credits%2Brecordings`);
      const release = (results as Release);

      const artists = release["artist-credit"];
      const releaseDate = release.date;
      const genres = release.tags;
      const genre = genres.length > 0 ? getGenre(genres[0].name) : undefined;

      return {
        albumArtist: artists.length > 0 ? artists[0].artist.name : undefined,
        releaseYear: releaseDate ? releaseDate.substring(0, 4) : undefined,
        genre: genre,
        trackCount: release["track-count"] ? release["track-count"].toString() : undefined,
      }
    } catch (e: any) {
      LogController.error(e.message);
      return undefined;
    }
  }

  /**
   * Gets info about an album.
   * @param albumName The name of the album.
   */
  async getAlbumInfo(albumName: string): Promise<MBAlbumInfo[]> {
    try {
      const results = await this.makeRequest<ReleaseGroupResponse>("GET", `release-group/?${this.extraOptions}&query=releasegroup:${albumName} OR alias:${albumName}`);
      const albums = (results as ReleaseGroupResponse)["release-groups"];

      const releases: MBAlbumInfo[] = [];

      for (const album of albums) {
        for (const release of album.releases) {
          const releaseAlbumInfo = await this.getReleaseInfo(release.id);
          if (releaseAlbumInfo) releases.push(releaseAlbumInfo);
        }
      }

      return releases;
    } catch (e: any) {
      LogController.error(e.message);
      return [];
    }
  }

  /**
   * Gets info about a song.
   * @param songName The name of the song.
   */
  async getSongInfo(songName: string): Promise<MBSongInfo[]> {
    try {
      const results = await this.makeRequest<RecordingResponse>("GET", `recording/?${this.extraOptions}&query=recording:${songName} OR alias:${songName}`);
      const recordings = (results as RecordingResponse).recordings;

      return recordings.map((recording) => {
        
        return {
          album: undefined,
          artist: undefined,
          albumArtist: undefined,
          composer: undefined,
          genre: undefined,
          trackNumber: undefined,
          releaseYear: undefined,
        }
      });
    } catch (e: any) {
      LogController.error(e.message);
      return [];
    }
  }
}