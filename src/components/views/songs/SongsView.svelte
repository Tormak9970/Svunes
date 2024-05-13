<script lang="ts">
  import { songGridSize, songs } from "../../../stores/State";
  import ViewContainer from "../ViewContainer.svelte";
  import ListEntry from "./list/ListEntry.svelte";
  import GridEntry from "./grid/GridEntry.svelte";
  import SongsHeader from "./header/SongsHeader.svelte";
  import VirtualList from "../../layout/VirtualList.svelte";
  import VirtualGrid from "../../layout/VirtualGrid.svelte";
  import { GridSize } from "../../../types/Settings";
  import { GRID_IMAGE_DIMENSIONS } from "../../../lib/utils/ImageConstants";
  
  let isAtTop = true;

  const keyFunction = (entry: any) => `${entry.data.title}${entry.data.album}${entry.data.artist}`;
</script>

<ViewContainer>
  <div slot="header">
    <SongsHeader highlight={!isAtTop} />
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if $songGridSize === GridSize.LIST}
      <VirtualList itemHeight={60} items={$songs} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
        <ListEntry song={entry} />
      </VirtualList>
    {:else}
      <VirtualGrid itemHeight={GRID_IMAGE_DIMENSIONS[$songGridSize].height + GRID_IMAGE_DIMENSIONS[$songGridSize].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[$songGridSize].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap} columnGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap} items={$songs} keyFunction={keyFunction} let:entry>
        <GridEntry song={entry} />
      </VirtualGrid>
    {/if}
  </div>
</ViewContainer>