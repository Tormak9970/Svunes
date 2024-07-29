<script lang="ts">
  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import type { Artist } from "@lib/models/Artist";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { t } from "@stores/Locale";
  import { artistsMap } from "@stores/State";
  import { GRID_IMAGE_DIMENSIONS } from "@utils";
  import ArtistGridEntry from "@views/artists/ArtistGridEntry.svelte";
  import { pop } from "svelte-spa-router";
  import { GridSize } from "../../types/Settings";
  
  const keyFunction = (entry: { data: Artist}) => `${entry.data.imagePath}${entry.data.name}${entry.data.albumNames.size}${entry.data.songIds.length}`;

  export let params: { key?: string } = {};
  $: artist = params.key ? $artistsMap[params!.key!] : undefined;
  $: allSimilarArtists = artist?.similarArtists ?? [];

  let highlight = true;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }
</script>

<DetailsBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">{$t("SIMILAR_ARTISTS_TITLE")}</div>
      </span>
      <span slot="right" />
    </OverlayHeader>
  </span>
  <span slot="content">
    <VirtualGrid name="similarArtists" saveState={false} itemHeight={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].height + GRID_IMAGE_DIMENSIONS[GridSize.LARGE].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} columnGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} items={allSimilarArtists} keyFunction={keyFunction} bind:isScrolled={highlight} let:entry>
      <ArtistGridEntry artist={entry} />
    </VirtualGrid>
  </span>
</DetailsBody>