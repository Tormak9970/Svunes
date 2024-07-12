import { http } from "@tauri-apps/api";
import { ResponseType, type HttpVerb } from "@tauri-apps/api/http";
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
   * @param method The method of the request.
   * @param url The url endpoint.
   */
  private async makeRequest<T>(method: HttpVerb, url: string): Promise<T | Error> {
    const options = {
      timeout: this.timeout,
      method: method,
      responseType: ResponseType.JSON,
      headers: {
        'User-Agent': this.userAgent,
        'Accept': `application/json`
      }
    }

    let response = await http.fetch<any>(`${this.BASE_URL}${url}`, options);

    if (response.ok) {
      return response.data;
    } else if (response.status === 404) {
      const errorMessage = response.data.substring(response.data.indexOf("<p>") + 3, response.data.indexOf("</p>"));
      throw new RequestError(errorMessage, response);
    } else {
      throw new RequestError(response.data?.error ?? "CoverartArchive error.", response);
    }
  }

  /**
   * Gets covers for the album.
   * @param releaseId The id of the release.
   */
  async getAlbumCovers(releaseId: string): Promise<string[]> {
    try {
      const results = await this.makeRequest<CoverResponse>("GET", `release/${releaseId}`);
      const images = (results as CoverResponse).images;

      return images.map((image) => image.image);
    } catch (e: any) {
      LogController.error(e.message);
      return [];
    }
  }
}