<script lang="ts">
  import { pop } from "svelte-spa-router";
  import Button from "../../components/interactables/Button.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import DetailsBody from "../../components/utils/DetailsBody.svelte";
  import { artistsMap } from "../../stores/State";
  import Icon from "../../components/utils/Icon.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import VirtualGrid from "../../components/layout/VirtualGrid.svelte";
  import { GRID_IMAGE_DIMENSIONS } from "../../lib/utils/ImageConstants";
  import { GridSize } from "../../types/Settings";
  import GridEntry from "../../components/views/artists/GridEntry.svelte";
  import type { Artist } from "../../lib/models/Artist";
  
  const keyFunction = (entry: { data: Artist}) => `${entry.data.imagePath}${entry.data.name}${entry.data.albumNames.size}${entry.data.songIds.length}`;

  export let params: { key?: string } = {};
  $: artist = params.key ? $artistsMap[params!.key!] : undefined;
  $: allSimilarArtists = artist?.similarArtists ?? [];

  let isAtTop = true;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }
</script>

<DetailsBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">Similar Artists</div>
      </span>
      <span slot="right" />
    </OverlayHeader>
  </span>
  <span slot="content">
    <VirtualGrid name="similarArtists" saveState={false} itemHeight={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].height + GRID_IMAGE_DIMENSIONS[GridSize.LARGE].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} columnGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} items={allSimilarArtists} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
      <GridEntry artist={entry} />
    </VirtualGrid>
  </span>
</DetailsBody>