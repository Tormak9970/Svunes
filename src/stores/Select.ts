import { derived, writable, type Writable } from "svelte/store";

export const selected: Writable<string[]> = writable([]);
export const inSelectMode = derived([selected], ([$names]) => $names.length !== 0);

export const bulkEditSongIds: Writable<string[]> = writable([]);