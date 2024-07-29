<script lang="ts">
  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import type { Album } from "@models";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { t } from "@stores/Locale";
  import { albumsMap, songs } from "@stores/State";
  import { GridSize } from "@types";
  import { GRID_IMAGE_DIMENSIONS } from "@utils";
  import AlbumGridEntry from "@views/albums/AlbumGridEntry.svelte";
  import { onMount } from "svelte";
  import { pop } from "svelte-spa-router";
  
  const keyFunction = (entry: { data: Album}) => `${entry.data.artPath}${entry.data.name}${entry.data.releaseYear}${entry.data.songIds.length}${entry.data.lastPlayedOn}`;

  let albums: Album[] = [];
  let highlight = false;

  onMount(() => {
    const albumNames: string[] = [];

    const sorted = $songs.sort((a, b) => a.numTimesPlayed - b.numTimesPlayed);

    for (const song of sorted) {
      if (song.album && albumNames.length < 10 && !albumNames.includes(song.album)) albumNames.push(song.album);

      if (albumNames.length === 10) break;
    }

    albums = albumNames.map((name) => $albumsMap[name]);
  });
</script>

<DetailsBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={pop}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div class="font-headline">{$t("TOP_ALBUMS_TITLE")}</div>
      </span>
      <span slot="right" />
    </OverlayHeader>
  </span>
  <span slot="content">
    <VirtualGrid name="topAlbums" saveState={false} itemHeight={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].height + GRID_IMAGE_DIMENSIONS[GridSize.LARGE].infoHeight + 12} itemWidth={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].width + 10} rowGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} columnGap={GRID_IMAGE_DIMENSIONS[GridSize.LARGE].gap} items={albums} keyFunction={keyFunction} bind:isScrolled={highlight} let:entry>
      <AlbumGridEntry album={entry} />
    </VirtualGrid>
  </span>
</DetailsBody>