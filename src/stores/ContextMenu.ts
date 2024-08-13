import type { ContextMenuItem } from "@directives";
import { writable } from "svelte/store";

export const contextMenuItems = writable<ContextMenuItem[]>([]);
export const contextMenuPosition = writable<{ x: number, y: number }>({ x: 0, y: 0 });
export const showContextMenu = writable(false);