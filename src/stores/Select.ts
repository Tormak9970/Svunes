import { derived, writable, type Writable } from "svelte/store";

export const selected: Writable<string[]> = writable([]);
export const inSelectMode = derived(selected, (names: string[]) => names.length !== 0);