import type { AlbumResult, SongResult } from "@lib/controllers/ApiController";
import { writable, type Writable } from "svelte/store";

export const showSavingSettings = writable(false);

export const showEditMusicFolders = writable(false);
export const showBlacklistFolders = writable(false);

export const showGridSize = writable(false);
export const showPlaylistSortOrder = writable(false);
export const showSongSortOrder = writable(false);
export const showAlbumSortOrder = writable(false);
export const showArtistSortOrder = writable(false);

export const showNowPlayingTheme = writable(false);
export const showNowPlayingBackground = writable(false);

export const showSelectLanguage = writable(false);

export const showEditViewOrder = writable(false);

export const showAdvancedFilters = writable(false);

export const showParserVariables = writable(false);

export const showArtOptions = writable(false);
export const onArtOptionsDone: Writable<(artPath: string | undefined) => void> = writable(() => {});

export const showSearchingApi = writable(false);
export const apiSearchCanceled = writable(false);


export const showImageResults = writable(false);
export const imageResults: Writable<string[]> = writable([]);
export const onImageResultsDone: Writable<(path: string | null) => void> = writable(() => {});

export const showSongInfoResults = writable(false);
export const songResults: Writable<SongResult[]> = writable([]);
export const onSongInfoResultsDone: Writable<(selected: SongResult | null) => void> = writable(() => {});

export const showAlbumInfoResults = writable(false);
export const albumResults: Writable<AlbumResult[]> = writable([]);
export const onAlbumInfoResultsDone: Writable<(selected: AlbumResult | null) => void> = writable(() => {});


export const showControlledModal = writable(false);
export const controlledModalTitle = writable("");
export const controlledModalMessage = writable("");
export const controlledModalConfirmText = writable("");
export const controlledModalConfirm = writable(async () => {});
export const controlledModalCancelText = writable("");
export const controlledModalCancel = writable(async () => {});