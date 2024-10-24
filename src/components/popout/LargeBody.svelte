<script lang="ts">
  import { DetailsArtPicture, Icon } from "@component-utils";
  import { FavoriteOff, FavoriteOn } from "@icons";
  import { Button } from "@interactables";
  import { Marquee } from "@layout";
  import { backgroundColorPopout, currentSongPopout, isFavoritedPopout } from "@stores/Popout";
  import LargeControls from "./LargeControls.svelte";
  import LargeProgress from "./LargeProgress.svelte";
  
  $: song = $currentSongPopout;
  $: label = song?.title ?? song?.fileName;
  $: artist = song?.artist;

  $: songLength = song?.length ?? 100;
  
  $: imagePath = song?.artPath;

  let containerHeight: number;
  let containerWidth: number;

  $: imageSize = containerHeight ? Math.min(containerHeight, containerWidth) - 10 : 370;
</script>

<div class="thumbnail-cont" style:--background-color={$backgroundColorPopout} bind:clientHeight={containerHeight} bind:clientWidth={containerWidth}>
  <div class="thumbnail">
    <DetailsArtPicture
      artPath={imagePath}
      borderRadius="4px"
      imageSize={imageSize}
      marginTop={false}
    />
  </div>
  <div class="overlay">
    <LargeControls />
    <LargeProgress songLength={songLength} />
  </div>
</div>
<div class="footer">
  {#key containerHeight}
    <div class="metadata">
      {#key label}
        <Marquee speed={40} gap={80}>
          <div class="title">{label}</div>
        </Marquee>
      {/key}
      {#key artist}
        <Marquee speed={40} gap={80}>
          <div class="font-body-medium artist">{artist}</div>
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

<style>
  .thumbnail-cont {
    width: 100%;

    height: calc(100% - 35px);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: rgb(var(--background-color));
    border-radius: 10px;
    overflow: hidden;

    position: relative;
  }

  .thumbnail-cont:hover .overlay {
    opacity: 1;
  }

  .overlay {
    position: absolute;

    top: 0px;

    width: 100%;
    height: 100%;

    background-color: rgb(var(--m3-scheme-scrim) / 0.7);

    display: flex;
    align-items: center;
    justify-content: space-around;

    opacity: 0;
    transition: opacity 0.15s ease-in-out;
  }

  .thumbnail {
    aspect-ratio: 1 / 1;
  }

  .footer {
    width: 100%;

    display: flex;
    align-items: center;

    justify-content: space-between;
  }

  .favorite {
    margin: 0px 0.5rem;
  }

  .artist {
    opacity: 0.7;
  }
</style>