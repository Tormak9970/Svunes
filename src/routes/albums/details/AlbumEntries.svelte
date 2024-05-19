<script lang="ts">
  import { LogController } from "../../../lib/controllers/LogController";
  import type { Song } from "../../../lib/models/Song";
  import { stringSort, nullishNumberSort } from "../../../lib/utils/Utils";
  import { songsMap } from "../../../stores/State";
  import type { AlbumEntriesSortOrder } from "../../../types/Settings";
  import AlbumEntry from "./AlbumEntry.svelte";

  export let sortOrder: AlbumEntriesSortOrder;
  export let songKeys: string[];
  $: songs = songKeys.map((key) => $songsMap[key]);

  /**
   * Sorts the album's songs.
   * @param songsList The list of songs.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortSongs(songsList: Song[], sortOrder: AlbumEntriesSortOrder): Song[] {
    let sorted: Song[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = songsList.sort(stringSort<Song>("title"));
    } else if (sortOrder === "Track Number") {
      sorted = songsList.sort(nullishNumberSort<Song>("trackNumber"));
    } else if (sortOrder === "Song Duration") {
      sorted = songsList.sort((a: Song, b: Song) => a.length - b.length);
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedSongs = sortSongs(songs, sortOrder);
</script>

<div class="album-entries">
  {#each sortedSongs as song, i (`${song.title}${i}${song.trackNumber}${song.length}`)}
    <AlbumEntry song={song} />
  {/each}
</div>

<style>
  .album-entries {
    width: 100%;
  }
</style>