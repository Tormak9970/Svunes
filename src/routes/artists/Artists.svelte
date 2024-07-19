<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import VirtualList from "@layout/VirtualList.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import type { Artist } from "@lib/models/Artist";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { stringSort } from "@lib/utils/Sorters";
  import { t } from "@stores/Locale";
  import { artistGridSize, artists, artistsIsAtTop, artistSortOrder } from "@stores/State";
  import ArtistsHeader from "@views/artists/ArtistsHeader.svelte";
  import GridEntry from "@views/artists/GridEntry.svelte";
  import ListEntry from "@views/artists/ListEntry.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
  import { afterUpdate } from "svelte";
  import { GridSize, type ArtistSortOrder } from "../../types/Settings";

  const keyFunction = (entry: { data: Artist}) => `${entry.data.imagePath}${entry.data.name}${entry.data.albumNames.size}${entry.data.songIds.length}`;

  let gridSize = $artistGridSize;

  /**
   * Sorts the artists.
   * @param artistsList The list of artists.
   * @param albumOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortArtists(artistsList: Artist[], sortOrder: ArtistSortOrder): Artist[] {
    let sorted: Artist[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = artistsList.sort(stringSort<Artist>("name"));
    } else if (sortOrder === "Album Count") {
      sorted = artistsList.sort((a: Artist, b: Artist) => b.albumNames.size - a.albumNames.size);
    } else if (sortOrder === "Track Count") {
      sorted = artistsList.sort((a: Artist, b: Artist) => b.songIds.length - a.songIds.length);
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedArtists = sortArtists($artists, $artistSortOrder);

  afterUpdate(() => {
    if ($artistGridSize !== gridSize) {
      gridSize = $artistGridSize;
      $artistsIsAtTop = true;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <ArtistsHeader highlight={!$artistsIsAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedArtists.length > 0}
      {#if $artistGridSize === GridSize.LIST}
        <VirtualList
          name="artistsView"
          itemHeight={60}
          items={sortedArtists}
          keyFunction={keyFunction}
          bind:isAtTop={$artistsIsAtTop}
          let:entry
        >
          <ListEntry artist={entry} />
        </VirtualList>
      {:else}
        <VirtualGrid
          name="artistsView"
          itemHeight={GRID_IMAGE_DIMENSIONS[$artistGridSize].height + GRID_IMAGE_DIMENSIONS[$artistGridSize].infoHeight + 12}
          itemWidth={GRID_IMAGE_DIMENSIONS[$artistGridSize].width + 10}
          rowGap={GRID_IMAGE_DIMENSIONS[$artistGridSize].gap}
          columnGap={GRID_IMAGE_DIMENSIONS[$artistGridSize].gap}
          items={sortedArtists}
          keyFunction={keyFunction}
          bind:isAtTop={$artistsIsAtTop}
          let:entry
        >
          <GridEntry artist={entry} />
        </VirtualGrid>
      {/if}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="font-label message">{$t("NO_TYPE_FOUND_MESSAGE").replace("{type}", $t("ARTIST_PLURAL_VALUE"))}.</div>
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
    text-align: center;
  }
</style>