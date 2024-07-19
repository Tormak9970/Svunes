<script lang="ts">
  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import type { Album } from "@lib/models/Album";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { t } from "@stores/Locale";
  import { albumsMap, artistsMap } from "@stores/State";
  import AlbumGridEntry from "@views/albums/AlbumGridEntry.svelte";
  import { pop } from "svelte-spa-router";
  import { GridSize } from "../../types/Settings";
  
  const keyFunction = (entry: { data: Album}) => `${entry.data.artPath}${entry.data.name}${entry.data.releaseYear}${entry.data.songIds.length}${entry.data.lastPlayedOn}`;

  export let params: { key?: string } = {};
  $: album = params.key ? $albumsMap[params!.key!] : undefined;
  $: artist = album?.albumArtist ? $artistsMap[album?.albumArtist] : undefined;
  $: artistOtherAlbums = Array.from(artist?.albumNames ?? []).filter((name) => name !== album?.name).map((name) => $albumsMap[name]);

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
        <div style="font-size: 20px;">{$t("MORE_FROM_TITLE")} {album?.albumArtist}</div>
      </span>
      <span slot="right" />
    </OverlayHeader>
  </span>
  <span slot="content">
    <VirtualGrid name="moreByArtist" saveState={false} itemHeight={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].height + GRID_IMAGE_DIMENSIONS[GridSize.LARGE].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} columnGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} items={artistOtherAlbums} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
      <AlbumGridEntry album={entry} />
    </VirtualGrid>
  </span>
</DetailsBody>