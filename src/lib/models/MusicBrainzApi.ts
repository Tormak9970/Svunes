import { LogController } from "@controllers";
import { fetch } from "@tauri-apps/plugin-http";
import type { Release, ReleaseGroup, ReleaseGroupResponse } from "@types";
import { RequestError } from "./RequestError";

export type MBAlbumInfo = {
  releaseId: string;
  title: string;
  artist: string | undefined;
  releaseYear: string | undefined;
  genres: string[];
}

export type MBSongInfo = {
  title: string;
  album: string | undefined;
  artist: string | undefined;
  albumArtist: string | undefined;
  composer: string | undefined;
  genres: string[];
  trackNumber: string | undefined;
  releaseYear: string | undefined;
}

/**
 * A wrapper for the MusicBrainz API.
 */
export class MusicBrainzApi {
  private readonly BASE_URL = "https://beta.musicbrainz.org/ws/2/";
  private readonly extraOptions = "fmt=json&limit=10";

  private userAgent: string;
  private timeout: number;


  constructor(userAgent: string, timeout: number) {
    this.userAgent = userAgent;
    this.timeout = timeout;
  }

  private escapeLuceneChars(query: string) {
    const specialChars = /[+\-\&\&\|\|!\(\)\{\}\[\]\^"~*?:\\]/g;

    return query.replace(specialChars, '\\$&');
  }

  /**
   * Makes a request and returns the result.
   * @param url The url endpoint.
   */
  private async makeRequest<T>(url: string): Promise<T | Error> {
    const options = {
      timeout: this.timeout,
      headers: {
        'User-Agent': this.userAgent
      }
    }

    let response = await fetch(`${this.BASE_URL}${url}`, options);

    if (response.ok) {
      return await response.json();
    } else {
      throw new RequestError(response.statusText ?? "MusicBrainz error.", response);
    }
  }

  /**
   * Gets information about a release given its id.
   * @param releaseId The id of the release to get.
   * @returns 
   */
  async getReleaseInfo(releaseId: string): Promise<MBAlbumInfo | undefined> {
    try {
      const results = await this.makeRequest<Release>(`release/${releaseId}?${this.extraOptions}&inc=tags%2Bartist-credits%2Brecordings`);
      const release = (results as Release);

      const artists = release["artist-credit"];
      const releaseDate = release.date;

      return {
        releaseId: release.id,
        title: release.title,
        artist: artists.length > 0 ? artists[0].artist.name : undefined,
        releaseYear: releaseDate ? releaseDate.substring(0, 4) : undefined,
        genres: release.tags.map((tag) => tag.name)
      }
    } catch (e: any) {
      LogController.error(e.message);
      return undefined;
    }
  }

  /**
   * Gets the release for an album.
   * @param albumName The name of the album.
   */
  async getReleaseGroups(albumName: string): Promise<ReleaseGroup[]> {
    const query = this.escapeLuceneChars(albumName);

    try {
      const results = await this.makeRequest<ReleaseGroupResponse>(`release-group/?${this.extraOptions}&query=releasegroup:${query}`);
      return (results as ReleaseGroupResponse)["release-groups"];
    } catch (e: any) {
      LogController.error(e.message);
      return [];
    }
  }
}