import { Song } from "@models";
import { writable } from "svelte/store";

export const currentSongPopout = writable<Song | null>(null);

export const backgroundColorPopout = writable("var(--m3-scheme-on-primary)");
export const isPausedPopout = writable(true);
export const shufflePopout = writable(false);
export const repeatPlayedPopout = writable(false);
export const isFavoritedPopout = writable(false);