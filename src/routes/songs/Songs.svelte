<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import VirtualList from "@layout/VirtualList.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import type { Song } from "@lib/models/Song";
  import t from "@lib/utils/i18n";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { dateSort, stringSort } from "@lib/utils/Sorters";
  import { songGridSize, songs, songsIsAtTop, songSortOrder } from "@stores/State";
  import GridEntry from "@views/songs/GridEntry.svelte";
  import ListEntry from "@views/songs/ListEntry.svelte";
  import SongsHeader from "@views/songs/SongsHeader.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
  import { afterUpdate } from "svelte";
  import { type SongSortOrder, GridSize } from "../../types/Settings";

  const keyFunction = (entry: { data: Song }) => entry.data.filePath;

  let gridSize = $songGridSize;

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
    } else if (sortOrder === "Most Played") {
      sorted = songsList.sort((a: Song, b: Song) => b.numTimesPlayed - a.numTimesPlayed);
    } else if (sortOrder === "Last Played") {
      sorted = songsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedSongs = sortSongs($songs, $songSortOrder);
  
  afterUpdate(() => {
    if ($songGridSize !== gridSize) {
      gridSize = $songGridSize;
      $songsIsAtTop = true;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <SongsHeader highlight={!$songsIsAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedSongs.length > 0}
      {#if $songGridSize === GridSize.LIST}
        <VirtualList
          name="songsView"
          itemHeight={60}
          items={sortedSongs}
          keyFunction={keyFunction}
          bind:isAtTop={$songsIsAtTop}
          let:entry
        >
          <ListEntry song={entry} detailType={$songSortOrder} />
        </VirtualList>
      {:else}
        <VirtualGrid
          name="songsView"
          itemHeight={GRID_IMAGE_DIMENSIONS[$songGridSize].height + GRID_IMAGE_DIMENSIONS[$songGridSize].infoHeight + 12}
          itemWidth={GRID_IMAGE_DIMENSIONS[$songGridSize].width + 10}
          rowGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap}
          columnGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap}
          items={sortedSongs} keyFunction={keyFunction}
          bind:isAtTop={$songsIsAtTop}
          let:entry
        >
          <GridEntry song={entry} />
        </VirtualGrid>
      {/if}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="message">{t("NO_TYPE_FOUND_MESSAGE").replace("{type}", t("SONG_PLURAL_VALUE"))}.</div>
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