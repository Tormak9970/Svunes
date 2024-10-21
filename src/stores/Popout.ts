import { backendWritable, Song } from "@models";
import { writable } from "svelte/store";

export const songProgressPopout = backendWritable(0);
export const currentSongPopout = writable<Song | null>(null);

export const isPausedPopout = backendWritable(true);
export const shufflePopout = backendWritable(false);
export const repeatPlayedPopout = backendWritable(false);
export const isFavoritedPopout = backendWritable(false);