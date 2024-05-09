import { writable, type Writable } from "svelte/store";
import { View } from "../types/View";

// * View stores
export const showViewNav = writable(true);
export const selectedView: Writable<View> = writable(0);
export const viewsToRender: Writable<View[]> = writable([ View.PLAYLISTS, View.ALBUMS, View.SONGS, View.GENRES, View.SETTINGS])


export const showNowPlayingSmall = writable(true);