<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import Marquee from "@layout/Marquee.svelte";
  import type { Song } from "@lib/models/Song";
  import { showCarMode, showMiniPlayer, showQueue } from "@stores/Overlays";
  import { nowPlayingBackgroundType, showExtraSongInfo } from "@stores/State";
  import { NowPlayingBackgroundType } from "../../../../types/Settings";
  import DetailsArtPicture from "../../../utils/DetailsArtPicture.svelte";
  import Icon from "../../../utils/Icon.svelte";
  import NowPlayingOptions from "../NowPlayingOptions.svelte";
  import PlayerControls from "../PlayerControls.svelte";
  import ProgressControls from "../ProgressControls.svelte";
  import VolumeControls from "../VolumeControls.svelte";
  
  import DirectionsCar from "@ktibow/iconset-material-symbols/directions-car-outline-rounded";
  import FavoriteOff from "@ktibow/iconset-material-symbols/favorite-outline-rounded";
  import FavoriteOn from "@ktibow/iconset-material-symbols/favorite-rounded";
  import KeyboardArrowDown from "@ktibow/iconset-material-symbols/keyboard-arrow-down-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import QueueMusic from "@ktibow/iconset-material-symbols/queue-music-rounded";
  
  let menuIsOpen = false;
  
  export let song: Song | undefined;
  $: songLength = song?.length ?? 0;
  export let isMp3: boolean | undefined;
  export let isFavorited: boolean | undefined;
  export let toggleFavorite: () => void;
  export let convertedPath: string;
  export let topBackgroundColor: string;
  export let bottomBackgroundColor: string;
</script>

<div
  class="container"
  style:--converted-background-path='url("{convertedPath}")'
  style:--top-background-color={topBackgroundColor}
  style:--bottom-background-color={bottomBackgroundColor}
>
  <div
    class="background"
    class:solid={$nowPlayingBackgroundType === NowPlayingBackgroundType.SOLID}
    class:gradient={$nowPlayingBackgroundType === NowPlayingBackgroundType.GRADIENT}
    class:blur={$nowPlayingBackgroundType === NowPlayingBackgroundType.BLUR}
  />
  <div style="margin-top: 15px;">
    <DetailsArtPicture artPath={song?.artPath} />
  </div>
  <div class="content">
    <ProgressControls songLength={songLength} />
    <div class="song-info">
      <div class="title">
        {#if song?.title.length && song?.title.length > 28}
          <div style="margin-left: 4%;">
            <Marquee speed={50} gap={100}>{song?.title}</Marquee>
          </div>
        {:else}
          {song?.title}
        {/if}
      </div>
      <div class="artist">{song?.artist ?? "Unkown"}</div>
      {#if $showExtraSongInfo}
        <div class="extra-info">{isMp3 ? "MP3" : "FLAC"} • {song?.displayFrequency()}</div>
      {/if}
    </div>
    <PlayerControls />
    <VolumeControls />
  </div>
  <div class="options">
    <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={() => $showMiniPlayer = true}>
      <Icon icon={KeyboardArrowDown} />
    </Button>
    <div class="right">
      <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={() => $showCarMode = true}>
        <Icon icon={DirectionsCar} />
      </Button>
      <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={toggleFavorite}>
        {#if !isFavorited}
          <Icon icon={FavoriteOff} />
        {:else}
          <Icon icon={FavoriteOn} />
        {/if}
      </Button>
      <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={() => $showQueue = true}>
        <Icon icon={QueueMusic} />
      </Button>
      <MenuButton icon={MoreVert} size="3rem" iconSize="1.75rem" bind:open={menuIsOpen}>
        <NowPlayingOptions bind:menuIsOpen={menuIsOpen} song={song} />
      </MenuButton>
    </div>
  </div>
</div>

<style>
  .container {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;

    color: rgb(var(--m3-scheme-on-background));
  }

  .content {
    width: calc(100% - 30px);
    padding: 0px 15px;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
    z-index: 2;
  }

  .song-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    width: 100%;

    margin: 20px 0px;
    gap: 20px;

    font-size: 24px;

    min-height: 110px;
  }

  .title { font-weight: bold; max-width: 100%; }
  .artist { font-size: 18px; }
  .extra-info { font-size: 14px; opacity: 0.8; }

  .options {
    width: calc(100% - 30px);
    padding: 0px 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    position: absolute;
    bottom: 15px;
  }

  .right {
    display: flex;
    align-items: center;
  }

  .background {
    height: 100%;
    width: 100%;

    position: absolute;
  }

  .background.solid {
    background: rgb(var(--bottom-background-color));
  }

  .background.gradient {
    background: linear-gradient(rgb(var(--top-background-color) / 0.3), rgb(var(--bottom-background-color)));
  }

  .background.blur {
    background-image: var(--converted-background-path);

    filter: blur(20px) brightness(0.8);

    height: 100%;

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>