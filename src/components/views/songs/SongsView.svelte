<script lang="ts">
  import { songGridSize, songSortOrder, songs } from "../../../stores/State";
  import ViewContainer from "../ViewContainer.svelte";
  import ListEntry from "./list/ListEntry.svelte";
  import GridEntry from "./grid/GridEntry.svelte";
  import SongsHeader from "./header/SongsHeader.svelte";
  import VirtualList from "../../layout/VirtualList.svelte";
  import VirtualGrid from "../../layout/VirtualGrid.svelte";
  import { GridSize, type SongSortOrder } from "../../../types/Settings";
  import { GRID_IMAGE_DIMENSIONS } from "../../../lib/utils/ImageConstants";
  import type { Song } from "../../../lib/models/Song";
  import { LogController } from "../../../lib/controllers/LogController";
  import { dateSort, stringSort } from "../../../lib/utils/Utils";
  
  let isAtTop = true;

  const keyFunction = (entry: any) => `${entry.data.title}${entry.data.album}${entry.data.artist}`;

  function sortSongs(songsList: Song[], sortOrder: SongSortOrder): Song[] {
    if (sortOrder === "Alphabetical") {
      return songsList.sort(stringSort<Song>("title"));
    } else if (sortOrder === "Album") {
      return songsList.sort(stringSort<Song>("album"));
    } else if (sortOrder === "Artist") {
      return songsList.sort(stringSort<Song>("artist"));
    } else if (sortOrder === "Year") {
      return songsList.sort((a: Song, b: Song) => b.releaseYear - a.releaseYear);
    } else if (sortOrder === "Last Played") {
      return songsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      return [];
    }
  }

  $: sortedSongs = sortSongs($songs, $songSortOrder);
</script>

<ViewContainer>
  <div slot="header">
    <SongsHeader highlight={!isAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if $songGridSize === GridSize.LIST}
      <VirtualList itemHeight={60} items={sortedSongs} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
        <ListEntry song={entry} />
      </VirtualList>
    {:else}
      <VirtualGrid itemHeight={GRID_IMAGE_DIMENSIONS[$songGridSize].height + GRID_IMAGE_DIMENSIONS[$songGridSize].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[$songGridSize].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap} columnGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap} items={sortedSongs} keyFunction={keyFunction} let:entry>
        <GridEntry song={entry} />
      </VirtualGrid>
    {/if}
  </div>
</ViewContainer>