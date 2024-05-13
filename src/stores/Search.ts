import { writable, type Writable } from "svelte/store";

export const selectedChip: Writable<"song" | "album" | "artist" | "all"> = writable("all");