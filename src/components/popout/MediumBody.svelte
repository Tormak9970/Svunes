<script lang="ts">
  import { DetailsArtPicture, Icon } from "@component-utils";
  import { FavoriteOff, FavoriteOn } from "@icons";
  import { Button } from "@interactables";
  import { Marquee } from "@layout";
  import { currentSongPopout, isFavoritedPopout } from "@stores/Popout";
  import MediumControls from "./MediumControls.svelte";
  
  $: song = $currentSongPopout;
  $: label = song?.title ?? song?.fileName;
  $: artist = song?.artist;
  
  $: imagePath = song?.artPath;

  let detailsContainerHeight: number;

  $: imageSize = detailsContainerHeight ? detailsContainerHeight - 10 : 370;
</script>

<div class="details-cont" bind:clientHeight={detailsContainerHeight}>
  <div class="thumbnail">
    <DetailsArtPicture
      artPath={imagePath}
      borderRadius="4px"
      imageSize={imageSize}
      marginTop={false}
    />
  </div>
  <div class="song-info" style:width="calc(100% - {detailsContainerHeight}px - 1rem)">
    {#key detailsContainerHeight}
      <div class="metadata">
        {#key label}
          <Marquee speed={40} gap={80}>
            <div class="title">{label}</div>
          </Marquee>
        {/key}
        {#key artist}
          <Marquee speed={40} gap={80}>
            <div class="artist">{artist}</div>
          </Marquee>
        {/key}
      </div>
    {/key}
    <div class="favorite">
      <Button type="text" iconType="full" on:click={() => $isFavoritedPopout = !$isFavoritedPopout}>
        {#if !$isFavoritedPopout}
          <Icon icon={FavoriteOff} />
        {:else}
          <Icon icon={FavoriteOn} />
        {/if}
      </Button>
    </div>
  </div>
</div>
<div class="controls">
  <MediumControls />
</div>

<style>
  .details-cont {
    width: 100%;

    height: calc(100% - 35px);

    display: flex;
    align-items: center;
  }

  .thumbnail {
    aspect-ratio: 1 / 1;
  }

  .song-info {
    flex-grow: 1;

    margin-left: 0.5rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .metadata {
    max-width: calc(100% - 40px - 2rem);
  }

  .favorite {
    margin: 0px 1rem;
  }

  .artist {
    opacity: 0.7;
  }
</style>