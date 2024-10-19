<script lang="ts" context="module">
  import { AppController, EditController, QueueController } from "@controllers";
  import type { ContextMenuItem } from "@directives";
  import type { Song } from "@models";
  import { showAddToPlaylist, songToAdd } from "@stores/Overlays";
  import { playlists, playlistsMap, songIdsToParse } from "@stores/State";
  import { goToSongDetails, goToSongEdit } from "@utils";
  import { location, push, replace } from "svelte-spa-router";
  import { get } from "svelte/store";

  const removeFromPlaylist = (songId: string) => {
    const id = get(location).slice(11);
    const playlist = get(playlistsMap)[id];

    playlist.removeSong(songId);
    
    playlists.set([ ...get(playlists) ]);
  }

  const playNext = (songId: string) => QueueController.playSongsNext([songId]);
  const queueSong = (songId: string) => QueueController.queueSongs([songId]);

  const addToPlaylist = (songId: string) => {
    songToAdd.set(songId);
    showAddToPlaylist.set(true);
  }

  const goToAlbum = (album?: string) => push(`/albums/${album!}`);
  const goToArtist = (artist?: string) => push(`/artists/${artist!}`);
  const showDetails = (songId: string) => goToSongDetails(songId);
  const showSongEdit = (songId: string) => goToSongEdit(songId);
  const share = (songId: string) => AppController.share([songId]);

  const showInfoParser = (songId: string) => {
    songIdsToParse.set([ songId ]);
    push("/metadata-parser");
  }

  const deleteSong = (songId: string) => {
    EditController.deleteSongsFromDevice([songId]);
    if (get(location).startsWith("/songs/")) replace("/songs");
  }

  export function getContextMenuItems(song: Song, translate: (key: string) => string, currentRoute: string, hideEditOption?: boolean): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    if (currentRoute.startsWith("/playlists")) {
      items.push({
        id: "remove-from-playlist",
        text: translate("REMOVE_FROM_PLAYLIST_ACTION"),
        action: () => removeFromPlaylist(song.id),
      });
    }

    items.push({
      id: "play-next",
      text: translate("PLAY_NEXT_ACTION"),
      action: () => playNext(song.id),
    });
    items.push({
      id: "queue",
      text: translate("ADD_TO_QUEUE_ACTION"),
      action: () => queueSong(song.id),
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

    if (!hideEditOption) {
      items.push({
        id: "edit-song",
        text: translate("EDIT_ACTION"),
        action: () => showSongEdit(song.id),
      });
    }

    items.push({
      id: "parse-info",
      text: translate("INFO_PARSER_ACTION"),
      action: () => showInfoParser(song.id),
    });
    items.push({
      id: "delete-song",
      text: translate("DELETE_ACTION"),
      action: () => deleteSong(song.id),
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
  export let hideEditOption = false;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }
</script>

{#if $location.startsWith("/playlists")}
  <MenuItem on:click={() => { removeFromPlaylist(song.id); closeOptions(); }}>
    {$t("REMOVE_FROM_PLAYLIST_ACTION")}
  </MenuItem>
{/if}
<MenuItem on:click={() => { playNext(song.id); closeOptions(); }}>
  {$t("PLAY_NEXT_ACTION")}
</MenuItem>
<MenuItem on:click={() => { queueSong(song.id); closeOptions(); }}>
  {$t("ADD_TO_QUEUE_ACTION")}
</MenuItem>
<MenuItem on:click={() => { addToPlaylist(song.id); closeOptions(); }}>
  {$t("ADD_TO_PLAYLISTS_ACTION")}
</MenuItem>
{#if song?.album}
  <MenuItem on:click={() => { goToAlbum(song.album); closeOptions(); }}>
    {$t("GO_TO_ALBUM_ACTION")}
  </MenuItem>
{/if}
{#if song?.artist}
  <MenuItem on:click={() => { goToArtist(song.artist); closeOptions(); }}>
    {$t("GO_TO_ARTIST_ACTION")}
  </MenuItem>
{/if}
<MenuItem on:click={() => { showDetails(song.id); closeOptions(); }}>
  {$t("DETAILS_ACTION")}
</MenuItem>
{#if !hideEditOption}
  <MenuItem on:click={() => { showSongEdit(song.id); closeOptions(); }}>
    {$t("EDIT_ACTION")}
  </MenuItem>
{/if}
<MenuItem on:click={() => { showInfoParser(song.id); closeOptions(); }}>
  {$t("INFO_PARSER_ACTION")}
</MenuItem>
<MenuItem on:click={() => { share(song.id); closeOptions(); }}>
  {$t("SHARE_ACTION")}
</MenuItem>
<MenuItem on:click={() => { deleteSong(song.id); closeOptions(); }}>
  {$t("DELETE_ACTION")}
</MenuItem>