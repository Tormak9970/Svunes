<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import VirtualList from "@layout/VirtualList.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import type { Album } from "@lib/models/Album";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { dateSort, stringSort } from "@lib/utils/Sorters";
  import { albumGridSize, albumSortOrder, albums, albumsIsAtTop } from "@stores/State";
  import AlbumsHeader from "@views/albums/AlbumsHeader.svelte";
  import GridEntry from "@views/albums/GridEntry.svelte";
  import ListEntry from "@views/albums/ListEntry.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
  import { afterUpdate } from "svelte";
  import { GridSize, type AlbumSortOrder } from "../../types/Settings";

  const keyFunction = (entry: { data: Album}) => `${entry.data.artPath}${entry.data.name}${entry.data.releaseYear}${entry.data.songIds.length}${entry.data.lastPlayedOn}`;

  let gridSize = $albumGridSize;

  /**
   * Sorts the albums.
   * @param albumsList The list of albums.
   * @param albumOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortAlbums(albumsList: Album[], sortOrder: AlbumSortOrder): Album[] {
    let sorted: Album[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = albumsList.sort(stringSort<Album>("name"));
    } else if (sortOrder === "Artist") {
      sorted = albumsList.sort(stringSort<Album>("albumArtist"));
    } else if (sortOrder === "Year") {
      sorted = albumsList.sort((a: Album, b: Album) => b.releaseYear - a.releaseYear);
    } else if (sortOrder === "Length") {
      sorted = albumsList.sort((a: Album, b: Album) => b.albumLength - a.albumLength);
    } else if (sortOrder === "Track Count") {
      sorted = albumsList.sort((a: Album, b: Album) => b.songIds.length - a.songIds.length);
    } else if (sortOrder === "Most Played") {
      sorted = albumsList.sort((a: Album, b: Album) => b.numTimesPlayed - a.numTimesPlayed);
    } else if (sortOrder === "Last Played") {
      sorted = albumsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedAlbums = sortAlbums($albums, $albumSortOrder);

  afterUpdate(() => {
    if ($albumGridSize !== gridSize) {
      gridSize = $albumGridSize;
      $albumsIsAtTop = true;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <AlbumsHeader highlight={!$albumsIsAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedAlbums.length > 0}
      {#key $albumGridSize}
        {#if $albumGridSize === GridSize.LIST}
          <VirtualList name="albumsView" itemHeight={60} items={sortedAlbums} keyFunction={keyFunction} bind:isAtTop={$albumsIsAtTop} let:entry>
            <ListEntry album={entry} />
          </VirtualList>
        {:else}
          <VirtualGrid name="albumsView" itemHeight={GRID_IMAGE_DIMENSIONS[$albumGridSize].height + GRID_IMAGE_DIMENSIONS[$albumGridSize].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[$albumGridSize].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[$albumGridSize].gap} columnGap={GRID_IMAGE_DIMENSIONS[$albumGridSize].gap} items={sortedAlbums} keyFunction={keyFunction} bind:isAtTop={$albumsIsAtTop} let:entry>
            <GridEntry album={entry} />
          </VirtualGrid>
        {/if}
      {/key}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="message">No albums found. Try adding music folders in settings</div>
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