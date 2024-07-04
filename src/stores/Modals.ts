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

export const showMetadataParser = writable(false);
export const songIdsToParse: Writable<string[]> = writable([]);

export const showArtOptions = writable(false);
export const onArtOptionsDone: Writable<(artPath: string | undefined) => void> = writable(() => {});

export const showDialogModal = writable(false);
export const dialogModalTitle = writable("");
export const dialogModalMessage = writable("");
export const dialogModalConfirmText = writable("");
export const dialogModalConfirm = writable(async () => {});
export const dialogModalCancelText = writable("");
export const dialogModalCancel = writable(async () => {});