import { derived, writable } from "svelte/store";

export const selected = writable<string[]>([]);
export const inSelectMode = derived([selected], ([$names]) => $names.length !== 0);

export const bulkEditSongIds = writable<string[]>([]);