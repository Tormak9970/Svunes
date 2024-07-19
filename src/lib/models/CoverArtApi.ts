import { fetch } from "@tauri-apps/plugin-http";
import { LogController } from "../controllers/utils/LogController";
import { RequestError } from "./TauriResponse";

type CovertType = 'Front' | 'Back' | 'Booklet' | 'Medium' | 'Obi' | 'Spine' | 'Track' | 'Tray' | 'Sticker' | 'Poster' | 'Liner' | 'Watermark' | 'Raw/Unedited' | 'Matrix/Runout' | 'Top' | 'Bottom' | 'Other';

type CoverImage = {
  types: CovertType[];
  front: boolean;
  back: boolean;
  edit: number;
  image: string;
  comment: string;
  approved: boolean;
  id: string;
  thumbnails: {
    large: string;
    small: string;
    '250': string;
    '500'?: string;
    '1200'?: string;
  };
}

type CoverResponse = {
  images: CoverImage[];
  release: string;
}

/**
 * A wrapper for the Coverart API.
 */
export class CoverArtApi {
  private readonly BASE_URL = "https://coverartarchive.org/";

  private userAgent: string;
  private timeout: number;


  constructor(userAgent: string, timeout: number) {
    this.userAgent = userAgent;
    this.timeout = timeout;
  }

  /**
   * Makes a request and returns the result.
   * @param url The url endpoint.
   */
  private async makeRequest<T>(url: string): Promise<T | Error> {
    const options = {
      timeout: this.timeout,
      headers: {
        'User-Agent': this.userAgent,
        'Accept': `application/json`
      }
    }

    let response = await fetch(`${this.BASE_URL}${url}`, options);

    if (response.ok) {
      return await response.json();
    } else {
      throw new RequestError(response.statusText ?? "CoverartArchive error.", response);
    }
  }

  /**
   * Gets covers for the album.
   * @param releaseId The id of the release.
   */
  async getAlbumCovers(releaseId: string): Promise<string[]> {
    try {
      const results = await this.makeRequest<CoverResponse>(`release/${releaseId}`);
      const images = (results as CoverResponse).images;

      return images.map((image) => image.image);
    } catch (e: any) {
      LogController.error(e.message);
      return [];
    }
  }
}