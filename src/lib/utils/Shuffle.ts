import { get } from "svelte/store";
import { songsMap } from "../../stores/State";
import type { Song } from "../models/Song";
import { getAllArtistNames } from "./Utils";

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [];

  while (array.length) {
    const randomIndex = Math.floor(Math.random() * array.length);
    const element = array.splice(randomIndex, 1);
    shuffled.push(element[0]);
  }

  return shuffled;
}

/**
 * Shuffles the songs in a manner that will appear random.
 * @param songKeys The keys of the songs to shuffle.
 */
export function shuffleSongs(songKeys: string[]): Song[] {
  const length = songKeys.length;
  const songMap = get(songsMap);

  const artistsToSongs: Record<string, Song[]> = {
    "Unkown": [],
  };

  const songs = songKeys.map((key) => {
    const song = songMap[key];
    const artist = song.artist ? getAllArtistNames(song.artist)[0] : "Unkown";

    if (!artistsToSongs[artist]) artistsToSongs[artist] = [];

    artistsToSongs[artist].push(song);

    return song;
  });

  const songIndices: Record<string, number> = {};

  for (const artistSongs of Object.values(artistsToSongs)) {
    if (artistSongs.length) {
      const gap = length / (artistSongs.length + 1);

      const range = gap / 5;
      const minGap = gap - range;
      const maxGap = gap + range;

      const startingOffset = Math.random() * (minGap) + range;

      const shuffled = shuffle(artistSongs);
      let lastIndex = startingOffset;
      for (let i = 0; i < shuffled.length; i++) {
        const index = lastIndex + (i ? 1 : 0) * (Math.random() * (maxGap - minGap) + minGap);
        lastIndex = index;
        
        songIndices[shuffled[i].key] = index;
      }
    }
  }

  return songs.sort((a, b) => songIndices[b.key] - songIndices[a.key]);
}