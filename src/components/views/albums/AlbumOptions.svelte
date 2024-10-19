<script lang="ts" context="module">
  import { EditController, PlaybackController, QueueController } from "@controllers";
  import type { ContextMenuItem } from "@directives";
  import type { Album } from "@models";
  import { albumToAdd, showAddToPlaylist } from "@stores/Overlays";
  import { goToAlbumEdit } from "@utils";
  import { location, replace } from "svelte-spa-router";
  import { get } from "svelte/store";

  const play = (album: Album) => PlaybackController.playAlbum(album);
  const playNext = (albumName: string) => QueueController.playAlbumsNext([albumName]);
  const queueAlbum = (albumName: string) => QueueController.queueAlbums([albumName]);

  const addToPlaylist = (albumName: string) => {
    albumToAdd.set(albumName);
    showAddToPlaylist.set(true);
  }

  const showAlbumEdit = (albumName: string) => goToAlbumEdit(albumName);

  const deleteAlbum = (albumName: string) => {
    EditController.deleteAlbumsFromDevice([albumName]);
    if (get(location).startsWith("/albums/")) replace("/albums");
  }

  export function getContextMenuItems(album: Album, translate: (key: string) => string): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    items.push({
      id: "play",
      text: translate("PLAY_ACTION"),
      action: () => play(album),
    });
    items.push({
      id: "play-next",
      text: translate("PLAY_NEXT_ACTION"),
      action: () => playNext(album.name),
    });
    items.push({
      id: "queue",
      text: translate("ADD_TO_QUEUE_ACTION"),
      action: () => queueAlbum(album.name),
    });

    items.push({
      id: "add-to-playlist",
      text: translate("ADD_TO_PLAYLISTS_ACTION"),
      action: () => addToPlaylist(album.name),
    });
    
    items.push({
      isSeparator: true,
    });

    items.push({
      id: "edit-album",
      text: translate("EDIT_ACTION"),
      action: () => showAlbumEdit(album.name),
    });
    items.push({
      id: "delete-album",
      text: translate("DELETE_ACTION"),
      action: () => deleteAlbum(album.name),
    });

    return items;
  }
</script>