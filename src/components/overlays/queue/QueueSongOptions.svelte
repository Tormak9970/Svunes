<script lang="ts" context="module">
  import { AppController } from "@controllers";
  import type { ContextMenuItem } from "@directives";
  import type { Song } from "@models";
  import { showAddToPlaylist, showQueue, songToAdd } from "@stores/Overlays";
  import { queue } from "@stores/State";
  import { goToSongDetails, goToSongEdit } from "@utils";
  import { push } from "svelte-spa-router";
  import { get } from "svelte/store";

  const removeFromQueue = (index: number) => {
    const queueList = get(queue);
    queueList.splice(index, 1);

    queue.set([ ...queueList ]);
  }

  const addToPlaylist = (songId: string) => {
    songToAdd.set(songId);
    showAddToPlaylist.set(true);
  }

  const goToAlbum = (album?: string) => {
    push(`/albums/${album!}`);
    showQueue.set(false);
  }
  const goToArtist = (artist?: string) => {
    push(`/artists/${artist!}`);
    showQueue.set(false);
  }
  const showDetails = (songId: string) => {
    goToSongDetails(songId);
    showQueue.set(false);
  }
  const showSongEdit = (songId: string) => {
    goToSongEdit(songId);
    showQueue.set(false);
  }
  const share = (songId: string) => AppController.share([songId]);

  export function getContextMenuItems(song: Song, index: number, translate: (key: string) => string): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    items.push({
      id: "dequeue",
      text: translate("REMOVE_FROM_QUEUE_ACTION"),
      action: () => removeFromQueue(index),
    });
    items.push({
      id: "add-to-playlist",
      text: translate("ADD_TO_PLAYLISTS_ACTION"),
      action: () => addToPlaylist(song.id),
    });
    
    items.push({
      isSeparator: true,
    });

    items.push({
      id: "view-details",
      text: translate("DETAILS_ACTION"),
      action: () => showDetails(song.id),
    });

    if (song.album) {
      items.push({
        id: "view-album",
        text: translate("GO_TO_ALBUM_ACTION"),
        action: () => goToAlbum(song.album),
      });
    }

    if (song.artist) {
      items.push({
        id: "view-artist",
        text: translate("GO_TO_ARTIST_ACTION"),
        action: () => goToArtist(song.artist),
      });
    }
    
    items.push({
      isSeparator: true,
    });

    items.push({
      id: "edit-song",
      text: translate("EDIT_ACTION"),
      action: () => showSongEdit(song.id),
    });

    items.push({
      id: "share-song",
      text: translate("SHARE_ACTION"),
      action: () => share(song.id),
    });

    return items;
  }
</script>

<script lang="ts">
  import { MenuItem } from "@layout";
  import { t } from "@stores/Locale";

  export let menuIsOpen: boolean;
  export let song: Song;
  export let index: number;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }
</script>

<MenuItem on:click={() => { removeFromQueue(index); closeOptions(); }}>{$t("REMOVE_FROM_QUEUE_ACTION")}</MenuItem>
<MenuItem on:click={() => { addToPlaylist(song.id); closeOptions(); }}>{$t("ADD_TO_PLAYLIST_ACTION")}</MenuItem>
{#if song?.album}
  <MenuItem on:click={() => { goToAlbum(song.album); closeOptions(); }}>{$t("GO_TO_ALBUM_ACTION")}</MenuItem>
{/if}
{#if song?.artist}
  <MenuItem on:click={() => { goToArtist(song.artist); closeOptions(); }}>{$t("GO_TO_ARTIST_ACTION")}</MenuItem>
{/if}
<MenuItem on:click={() => { showDetails(song.id); closeOptions(); }}>{$t("DETAILS_ACTION")}</MenuItem>
<MenuItem on:click={() => { showSongEdit(song.id); closeOptions(); }}>{$t("EDIT_ACTION")}</MenuItem>
<MenuItem on:click={() => { share(song.id); closeOptions(); }}>{$t("SHARE_ACTION")}</MenuItem>