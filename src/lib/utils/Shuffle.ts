import { songsMap } from "@stores/State";
import { get } from "svelte/store";
import type { Song } from "../models/Song";
import { getAllArtistNames } from "./Utils";

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
export function shuffle<T>(array: T[]): T[] {
  const copied = [ ...array ];
  const shuffled = [];

  while (copied.length) {
    const randomIndex = Math.floor(Math.random() * copied.length);
    const element = copied.splice(randomIndex, 1);
    shuffled.push(element[0]);
  }

  return shuffled;
}

/**
 * Shuffles the songs in a manner that will appear random.
 * @param songIds The ids of the songs to shuffle.
 */
export function shuffleSongs(songIds: string[]): string[] {
  const length = songIds.length;
  const songMap = get(songsMap);

  const artistsToSongs: Record<string, Song[]> = {
    "Unkown": [],
  };

  for (const id of songIds) {
    const song = songMap[id];
    const artist = song.artist ? getAllArtistNames(song.artist)[0] : "Unkown";

    if (!artistsToSongs[artist]) artistsToSongs[artist] = [];

    artistsToSongs[artist].push(song);
  }

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
        
        songIndices[shuffled[i].id] = index;
      }
    }
  }

  return songIds.sort((a, b) => songIndices[b] - songIndices[a]);
}