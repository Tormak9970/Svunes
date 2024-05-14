import { path } from "@tauri-apps/api";

function calcSize(size: string): string {
  const sizeNum = parseFloat(size);

  if (sizeNum < 1000000) {
    return (sizeNum / 1000).toFixed(1) + " Kb";
  } else if (sizeNum < 1000000000) {
    return (sizeNum / 1000000).toFixed(1) + " Mb";
  } else {
    return (sizeNum / 1000000000).toFixed(1) + " Gb";
  }
}

/**
 * Class representing a song.
 */
export class Song {
  title: string;
  album: string;
  artist: string;
  releaseYear: number;
  length: number;
  bitRate: number;
  sampleRate: number;
  size: string;
  filePath: string;
  albumPath: string;
  lastPlayedOn: string;
  genre?: string;
  trackNumber?: string;
  totalTracks?: string;

  /**
   * Creates a new Song.
   */
  constructor(title: string, album: string, artist: string, releaseYear: number, length: number, bitRate: number, sampleRate: number, size: string, filePath: string, albumPath: string, lastPlayedOn: string, genre?: string, trackNumber?: string, totalTracks?: string) {
    this.title = title;
    this.album = album;
    this.artist = artist;
    this.releaseYear = releaseYear;
    this.length = length;
    this.bitRate = bitRate;
    this.sampleRate = sampleRate;
    this.size = size;
    this.filePath = filePath;
    this.albumPath = albumPath;
    this.lastPlayedOn = lastPlayedOn;
    this.genre = genre;
    this.trackNumber = trackNumber;
    this.totalTracks = totalTracks;
  }

  // play() {

  // }

  // toJSON() {
  //   // TODO: may want this
  // }

  /**
   * Gets a song object from a json object.
   * @param json The song json object.
   * @returns The song object.
   */
  static fromJSON(json: any, lastPlayedOn = "Never"): Song {
    let title, album, artist, releaseYear, length, bitRate, sampleRate, size, filePath, albumPath, genre, trackNumber, totalTracks;
    
    if (json.title && json.filename.endsWith("flac")) {
      title = json.title;
      album = json.album;
      artist = json.artist;
      releaseYear = json.date;

      trackNumber = json.tracknumber;
      totalTracks = json.totaltracks ?? json.tracktotal;
    } else {
      title = json.tit2 ?? json.tt2;

      if (!title) {
        const nameStartIdx = json.filename.lastIndexOf(path.sep) + 1;
        const extensionIdx = json.filename.lastIndexOf(".");
        title = json.filename.substring(nameStartIdx, extensionIdx);
      }

      album = json.talb ?? json.tal;
      artist = json.tpe1 ?? json.tp1 ?? json.tcom;
      releaseYear = json.tyer ?? json.tye;
      genre = json.tcon ?? json.tco;

      if (json.trk) {
        const parts = json.trk.split("/");
        trackNumber = parts[0];
        totalTracks = parts[1];
      } else {
        trackNumber = json.trck;
      }
    }
    
    length = parseInt(json.length);
    bitRate = parseInt(json.bitrate);
    sampleRate = parseInt(json.sampleRate);
    size = calcSize(json.size);
    filePath = json.filename;
    albumPath = json.albumpath;

    return new Song(title, album, artist, releaseYear ? parseInt(releaseYear) : -1, length, bitRate, sampleRate, size, filePath, albumPath, lastPlayedOn, genre, trackNumber, totalTracks);
  }
}