<script lang="ts" context="module">
  import { PlaybackController, QueueController } from "@controllers";
  import type { ContextMenuItem } from "@directives";
  import type { Genre } from "@models";

  const play = (genre: Genre) => PlaybackController.playGenre(genre);
  const playNext = (genreName: string) => QueueController.playGenresNext([genreName]);
  const queueGenre = (genreName: string) => QueueController.queueGenres([genreName]);

  export function getContextMenuItems(genre: Genre, translate: (key: string) => string): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    items.push({
      id: "play",
      text: translate("PLAY_ACTION"),
      action: () => play(genre),
    });
    items.push({
      id: "play-next",
      text: translate("PLAY_NEXT_ACTION"),
      action: () => playNext(genre.name),
    });
    items.push({
      id: "queue",
      text: translate("ADD_TO_QUEUE_ACTION"),
      action: () => queueGenre(genre.name),
    });

    return items;
  }
</script>