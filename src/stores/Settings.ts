import { writable, type Writable } from "svelte/store";
import { View } from "../types/View";

export const fromView: Writable<View> = writable(View.SONGS);