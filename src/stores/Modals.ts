import type { AlbumInfo, SelectedAlbum } from "@controllers";
import type { Update } from "@tauri-apps/plugin-updater";
import type { ReleaseGroup } from "@types";
import { writable } from "svelte/store";

export const showUpdateModal = writable(false);
export const updateData = writable<Update | null>(null);

export const showManageProfiles = writable(false);
export const showAddProfile = writable(false);

export const showManageEqs = writable(false);
export const showAddEq = writable(false);

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
export const showHelpTranslate = writable(false);
export const showTranslationCredits = writable(false);

export const showEditViewOrder = writable(false);

export const showAdvancedFilters = writable(false);

export const showParserVariables = writable(false);

export const showArtOptions = writable(false);
export const onArtOptionsDone = writable<(artPath: string | undefined) => void>(() => {});

export const showSearchingApi = writable(false);
export const apiSearchCanceled = writable(false);


export const availableReleaseGroups = writable<ReleaseGroup[]>([]);
export const selectedReleaseGroupId = writable("");

export const showPickAlbumCover = writable(false);
export const albumCovers = writable<string[]>([]);
export const onPickCoverDone = writable<(path: string | null) => void>(() => {});

export const showPickAlbumInfo = writable(false);
export const albumInfos = writable<AlbumInfo[]>([]);
export const onAlbumInfoDone = writable<(selected: SelectedAlbum | null) => void>(() => {});


export const showControlledModal = writable(false);
export const controlledModalTitle = writable("");
export const controlledModalMessage = writable("");
export const controlledModalConfirmText = writable("");
export const controlledModalConfirm = writable(async () => {});
export const controlledModalCancelText = writable("");
export const controlledModalCancel = writable(async () => {});