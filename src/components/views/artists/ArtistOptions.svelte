<script lang="ts" context="module">
  import { PlaybackController, QueueController } from "@controllers";
  import type { ContextMenuItem } from "@directives";
  import type { Artist } from "@models";

  const play = (artist: Artist) => PlaybackController.playArtist(artist);
  const playNext = (artistName: string) => QueueController.playArtistsNext([artistName]);
  const queueArtist = (artistName: string) => QueueController.queueArtists([artistName]);

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

    return items;
  }
</script>