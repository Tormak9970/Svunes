<script lang="ts" context="module">
  import { PlaybackController, QueueController } from "@controllers";
  import type { ContextMenuItem } from "@directives";
  import type { Artist } from "@models";
  import { artistToAdd, showAddToPlaylist } from "@stores/Overlays";

  const play = (artist: Artist) => PlaybackController.playArtist(artist);
  const playNext = (artistName: string) => QueueController.playArtistsNext([artistName]);
  const queueArtist = (artistName: string) => QueueController.queueArtists([artistName]);
  const addToPlaylist = (artistName: string) => {
    artistToAdd.set(artistName);
    showAddToPlaylist.set(true);
  }

  export function getContextMenuItems(artist: Artist, translate: (key: string) => string): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    items.push({
      id: "play",
      text: translate("PLAY_ACTION"),
      action: () => play(artist),
    });
    items.push({
      id: "play-next",
      text: translate("PLAY_NEXT_ACTION"),
      action: () => playNext(artist.name),
    });
    items.push({
      id: "queue",
      text: translate("ADD_TO_QUEUE_ACTION"),
      action: () => queueArtist(artist.name),
    });
    items.push({
      id: "add-to-playlist",
      text: translate("ADD_TO_PLAYLISTS_ACTION"),
      action: () => addToPlaylist(artist.name),
    });

    return items;
  }
</script>