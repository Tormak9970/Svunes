<script lang="ts" context="module">
  import { PlaybackController, QueueController } from "@controllers";
  import type { ContextMenuItem } from "@directives";
  import type { Genre } from "@models";
  import { genreToAdd, showAddToPlaylist } from "@stores/Overlays";

  const play = (genre: Genre) => PlaybackController.playGenre(genre);
  const playNext = (genreName: string) => QueueController.playGenresNext([genreName]);
  const queueGenre = (genreName: string) => QueueController.queueGenres([genreName]);
  const addToPlaylist = (genreName: string) => {
    genreToAdd.set(genreName);
    showAddToPlaylist.set(true);
  }

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
    items.push({
      id: "add-to-playlist",
      text: translate("ADD_TO_PLAYLISTS_ACTION"),
      action: () => addToPlaylist(genre.name),
    });

    return items;
  }
</script>