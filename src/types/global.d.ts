/// <reference types="svelte" />
/// <reference types="vite/client" />

declare const APP_VERSION: string;

type DialogModalType = "INFO" | "WARNING" | "ERROR";

type ShowErrorOptions = {
  message: string;
  faster?: boolean;
}

type ShowInfoOptions = {
  message: string;
}

type ShowSnackbarOptions = {
  message: string;
  timeout?: number | null;
}

declare module "svelte-icons/md/*.svelte";

declare type Item = import('svelte-dnd-action').Item;
declare type DndEvent<ItemType = Item> = import('svelte-dnd-action').DndEvent<ItemType>;
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
		onfinalize?: (event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }) => void;
	}
}

type SongEditFields = {
  artPath: string | undefined;
  title: string | undefined;
  album: string | undefined;
  composer: string | undefined;
  albumArtist: string | undefined;
  artist: string | undefined;
  releaseYear: number | undefined;
  genre: string | undefined;
  trackNumber: number | undefined;
}

type AlbumEditFields = {
  artPath: string | undefined;
  name: string;
  albumArtist: string | undefined;
  releaseYear: number | undefined;
  genre: string | undefined;
}