<script lang="ts">
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import { Icon } from "m3-svelte";
  import ViewContainer from "../../components/views/utils/ViewContainer.svelte";
  import VirtualGrid from "../../components/layout/VirtualGrid.svelte";
  import VirtualList from "../../components/layout/VirtualList.svelte";
  import GridEntry from "../../components/views/songs/GridEntry.svelte";
  import ListEntry from "../../components/views/songs/ListEntry.svelte";
  import SongsHeader from "../../components/views/songs/SongsHeader.svelte";
  import { LogController } from "../../lib/controllers/LogController";
  import type { Song } from "../../lib/models/Song";
  import { GRID_IMAGE_DIMENSIONS } from "../../lib/utils/ImageConstants";
  import { stringSort, dateSort } from "../../lib/utils/Utils";
  import { songs, songSortOrder, songGridSize } from "../../stores/State";
  import { type SongSortOrder, GridSize } from "../../types/Settings";

  let isAtTop = true;

  const keyFunction = (entry: { data: Song }) => `${entry.data.artPath}${entry.data.title}${entry.data.album}${entry.data.artist}${entry.data.releaseYear}${entry.data.lastPlayedOn}`;

  /**
   * Sorts the songs.
   * @param songsList The list of songs.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortSongs(songsList: Song[], sortOrder: SongSortOrder): Song[] {
    let sorted: Song[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = songsList.sort(stringSort<Song>("title"));
    } else if (sortOrder === "Album") {
      sorted = songsList.sort(stringSort<Song>("album"));
    } else if (sortOrder === "Artist") {
      sorted = songsList.sort(stringSort<Song>("artist"));
    } else if (sortOrder === "Year") {
      sorted = songsList.sort((a: Song, b: Song) => b.releaseYear - a.releaseYear);
    } else if (sortOrder === "Last Played") {
      sorted = songsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedSongs = sortSongs($songs, $songSortOrder);
</script>

<ViewContainer>
  <div slot="header">
    <SongsHeader highlight={!isAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedSongs.length > 0}
      {#if $songGridSize === GridSize.LIST}
        <VirtualList itemHeight={60} items={sortedSongs} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
          <ListEntry song={entry} />
        </VirtualList>
      {:else}
        <VirtualGrid itemHeight={GRID_IMAGE_DIMENSIONS[$songGridSize].height + GRID_IMAGE_DIMENSIONS[$songGridSize].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[$songGridSize].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap} columnGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap} items={sortedSongs} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
          <GridEntry song={entry} />
        </VirtualGrid>
      {/if}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="message">No songs found. Try adding music folders in settings</div>
      </div>
    {/if}
  </div>
</ViewContainer>

<style>
  .message-container {
    margin-top: 40%;
    color: rgb(var(--m3-scheme-on-secondary));
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message {
    max-width: 300px;
    font-size: 18px;
    text-align: center;
  }
</style>