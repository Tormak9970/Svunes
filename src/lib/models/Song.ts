import { path } from "@tauri-apps/api";

/**
 * Gets the size to render.
 * @param size The size string.
 * @returns The calculated size.
 */
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
  album?: string;
  artist?: string;
  composer?: string;
  albumArtist?: string;
  releaseYear: number;
  length: number;
  bitRate: number;
  sampleRate: number;
  size: string;
  filePath: string;
  artPath: string | undefined;
  lastPlayedOn: string;
  genre?: string;
  trackNumber?: string;
  totalTracks?: string;

  /**
   * Creates a new Song.
   */
  constructor(title: string, album: string | undefined, artist: string | undefined, composer: string | undefined, albumArtist: string | undefined, releaseYear: number, length: number, bitRate: number, sampleRate: number, size: string, filePath: string, artPath: string, lastPlayedOn: string, genre?: string, trackNumber?: string, totalTracks?: string) {
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

  // toJSON() {
  //   // TODO: may want this
  // }

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
      composer = json.composer;
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
      artist = json.tpe1 ?? json.tp1;
      composer = json.tcom ?? json.tcm;
      albumArtist = json.tpe2 ?? json.tp2;
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
    artPath = json.albumpath;

    return new Song(title, album, artist, composer, albumArtist, releaseYear ? parseInt(releaseYear) : -1, length, bitRate, sampleRate, size, filePath, artPath, lastPlayedOn, genre, trackNumber, totalTracks);
  }
}