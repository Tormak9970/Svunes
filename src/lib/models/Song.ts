import { path } from "@tauri-apps/api";
import { albumsMap } from "../../stores/State";
import { get } from "svelte/store";
import { formatTime } from "../utils/Utils";

/**
 * Class representing a song.
 */
export class Song {
  title: string;
  album?: string;
  artist?: string;
  composer?: string;
  albumArtist?: string;
  releaseYear: number;
  length: number;
  bitRate: number;
  sampleRate: number;
  size: number;
  filePath: string;
  artPath: string | undefined;
  lastPlayedOn: string;
  genre?: string;
  trackNumber?: number;
  totalTracks?: number;

  /**
   * Creates a new Song.
   */
  constructor(title: string, album: string | undefined, artist: string | undefined, composer: string | undefined, albumArtist: string | undefined, releaseYear: number, length: number, bitRate: number, sampleRate: number, size: number, filePath: string, artPath: string, lastPlayedOn: string, genre?: string, trackNumber?: number, totalTracks?: number) {
    this.title = title;
    this.album = album;
    this.artist = artist;
    this.composer = composer;
    this.albumArtist = albumArtist;
    this.releaseYear = releaseYear;
    this.length = length;
    this.bitRate = bitRate;
    this.sampleRate = sampleRate;
    this.size = size;
    this.filePath = filePath;
    this.artPath = artPath;
    this.lastPlayedOn = lastPlayedOn;
    this.genre = genre;
    this.trackNumber = trackNumber;
    this.totalTracks = totalTracks;
  }

  // play() {

  // }

  /**
   * Gets the file name of the song.
   */
  getFileName(): string {
    const fileNameStart = this.filePath.lastIndexOf(path.sep);
    return this.filePath.substring(fileNameStart+1);
  }

  /**
   * Gets the folder path of the song.
   */
  getFolder(): string {
    const fileNameStart = this.filePath.lastIndexOf(path.sep);
    return this.filePath.substring(0, fileNameStart);
  }

  /**
   * Displays the song's track information.
   */
  displayTrack(): string {
    const albumMap = get(albumsMap);
    if (this.trackNumber && this.totalTracks) {
      return this.trackNumber.toString() + " / " + this.totalTracks.toString();
    } else if (this.trackNumber && this.album && albumMap[this.album]) {
      return this.trackNumber.toString() + " / " + albumMap[this.album].songNames.length.toString();
    } else if (this.trackNumber) {
      return this.trackNumber.toString();
    } else {
      return "Unkown";
    }
  }

  /**
   * Displays the length of the song.
   */
  displayLength(): string {
    return formatTime(this.length);
  }

  /**
   * Displays the length of the song.
   */
  displaySize(): string {
    const sizeNum = this.size;

    if (sizeNum < 1000000) {
      return (sizeNum / 1000).toFixed(1) + " Kb";
    } else if (sizeNum < 1000000000) {
      return (sizeNum / 1000000).toFixed(1) + " Mb";
    } else {
      return (sizeNum / 1000000000).toFixed(1) + " Gb";
    }
  }

  /**
   * Displays the song's bitrate and sample rate
   */
  displayFrequency(): string {
    return this.bitRate / 1000 + " kbit/s at " + this.sampleRate / 1000 + " Hz";
  }

  /**
   * Gets a song object from a json object.
   * @param json The song json object.
   * @returns The song object.
   */
  static fromJSON(json: any, lastPlayedOn = "Never"): Song {
    let title, album, artist, composer, albumArtist, releaseYear, length, bitRate, sampleRate, size, filePath, artPath, genre, trackNumber, totalTracks;
    
    if (json.title && json.filename.endsWith("flac")) {
      title = json.title;
      album = json.album;
      artist = json.artist;
      albumArtist = json.albumartist;
      genre = json.genre;
      composer = json.composer;
      releaseYear = json.date;

      trackNumber = json.tracknumber ? parseInt(json.tracknumber) : undefined;
      const stringTotalTracks = json.totaltracks ?? json.tracktotal;
      totalTracks = stringTotalTracks ? parseInt(stringTotalTracks) : undefined;
    } else {
      title = json.tit2 ?? json.tt2;

      if (!title) {
        const nameStartIdx = json.filename.lastIndexOf(path.sep) + 1;
        const extensionIdx = json.filename.lastIndexOf(".");
        title = json.filename.substring(nameStartIdx, extensionIdx);
      }

      album = json.talb ?? json.tal;
      artist = json.tpe1 ?? json.tp1;
      composer = json.tcom ?? json.tcm;
      albumArtist = json.tpe2 ?? json.tp2;
      releaseYear = json.tyer ?? json.tye;
      genre = json.tcon ?? json.tco;

      if (json.trk) {
        const parts = json.trk.split("/");
        trackNumber = parseInt(parts[0]);
        totalTracks = parseInt(parts[1]);
      } else {
        trackNumber = parseInt(json.trck);
      }
    }
    
    length = parseInt(json.length);
    bitRate = parseInt(json.bitrate);
    sampleRate = parseInt(json.samplerate);
    size = parseInt(json.size);
    filePath = json.filename;
    artPath = json.albumpath;

    return new Song(title, album, artist, composer, albumArtist, releaseYear ? parseInt(releaseYear) : -1, length, bitRate, sampleRate, size, filePath, artPath, lastPlayedOn, genre, trackNumber, totalTracks);
  }
}