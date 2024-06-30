<script lang="ts">
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import VirtualList from "@layout/VirtualList.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import type { Playlist } from "@lib/models/Playlist";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { dateSort, stringSort } from "@lib/utils/Sorters";
  import { playlistGridSize, playlists, playlistsIsAtTop, playlistSortOrder } from "@stores/State";
  import GridEntry from "@views/playlists/GridEntry.svelte";
  import ListEntry from "@views/playlists/ListEntry.svelte";
  import PlaylistsHeader from "@views/playlists/PlaylistsHeader.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
  import { afterUpdate } from "svelte";
  import { type PlaylistSortOrder, GridSize } from "../../types/Settings";

  const keyFunction = (entry: { data: Playlist }) => `${entry.data.name}${entry.data.songIds.length}${entry.data.numTimesPlayed}${entry.data.lastPlayedOn}`;

  let gridSize = $playlistGridSize;

  /**
   * Sorts the playlists.
   * @param playlistsList The list of playlists.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortPlaylists(playlistsList: Playlist[], sortOrder: PlaylistSortOrder): Playlist[] {
    let sorted: Playlist[] = [];

    if (sortOrder === "Alphabetical") {
      sorted = playlistsList.sort(stringSort<Playlist>("name"));
    } else if (sortOrder === "Song Count") {
      sorted = playlistsList.sort((a: Playlist, b: Playlist) => b.songIds.length - a.songIds.length);
    } else if (sortOrder === "Most Played") {
      sorted = playlistsList.sort((a: Playlist, b: Playlist) => b.numTimesPlayed - a.numTimesPlayed);
    } else if (sortOrder === "Last Played") {
      sorted = playlistsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: pinned = $playlists.filter((playlist) => playlist.pinned);
  $: sortedPinned = sortPlaylists(pinned, $playlistSortOrder);
  $: unPinned = $playlists.filter((playlist) => !playlist.pinned);
  $: sortedUnPinned = sortPlaylists(unPinned, $playlistSortOrder);

  $: sortedPlaylists = [ ...sortedPinned, ...sortedUnPinned ];
  
  afterUpdate(() => {
    if ($playlistGridSize !== gridSize) {
      gridSize = $playlistGridSize;
      $playlistsIsAtTop = true;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <PlaylistsHeader highlight={!$playlistsIsAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedPlaylists.length > 0}
      {#if $playlistGridSize === GridSize.LIST}
        <VirtualList name="playlistsView" itemHeight={60} items={sortedPlaylists} keyFunction={keyFunction} bind:isAtTop={$playlistsIsAtTop} let:entry>
          <ListEntry playlist={entry} />
        </VirtualList>
      {:else}
        <VirtualGrid name="playlistsView" itemHeight={GRID_IMAGE_DIMENSIONS[$playlistGridSize].height + GRID_IMAGE_DIMENSIONS[$playlistGridSize].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[$playlistGridSize].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[$playlistGridSize].gap} columnGap={GRID_IMAGE_DIMENSIONS[$playlistGridSize].gap} items={sortedPlaylists} keyFunction={keyFunction} bind:isAtTop={$playlistsIsAtTop} let:entry>
          <GridEntry playlist={entry} />
        </VirtualGrid>
      {/if}
    {/if}
  </div>
</ViewContainer>