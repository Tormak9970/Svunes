import { desktopSidePanel, isLandscape, sidePanelProps, SidePanels } from "@stores/Layout";
import { push } from "svelte-spa-router";
import { get } from "svelte/store";

/**
 * Displays the details for the provided song.
 * @param songId The id of the song to display details for.
 */
export function goToSongDetails(songId: string) {
  if (!get(isLandscape)) {
    push(`/songs/${songId}`);
    return;
  }

  sidePanelProps.set({ id: songId });
  desktopSidePanel.set(SidePanels.SONG_DETAILS);
}

/**
 * Displays the edit page for the provided song.
 * @param songId The id of the song to edit.
 */
export function goToSongEdit(songId: string) {
  if (!get(isLandscape)) {
    push(`/songs/${songId}/edit`);
    return;
  }

  sidePanelProps.set({ id: songId });
  desktopSidePanel.set(SidePanels.SONG_EDIT);
}

/**
 * Displays the bulk edit page for the current selection.
 */
export function goToBulkEdit() {
  if (!get(isLandscape)) {
    push("/songs/bulk-edit");
    return;
  }

  desktopSidePanel.set(SidePanels.SONG_BULK_EDIT);
}

/**
 * Displays the edit page for the provided album.
 * @param albumName The name of the album to edit.
 */
export function goToAlbumEdit(albumName: string) {
  if (!get(isLandscape)) {
    push(`/albums/${albumName}/edit`);
    return;
  }

  sidePanelProps.set({ key: albumName });
  desktopSidePanel.set(SidePanels.ALBUM_EDIT);
}