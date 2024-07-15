<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import Marquee from "@layout/Marquee.svelte";
  import type { Song } from "@lib/models/Song";
  import { formatTime } from "@lib/utils/Utils";
  import { showMiniPlayer, showQueue } from "@stores/Overlays";
  import { nowPlayingBackgroundType, songProgress } from "@stores/State";
  import { NowPlayingBackgroundType } from "../../../../types/Settings";
  import DetailsArtPicture from "../../../utils/DetailsArtPicture.svelte";
  import NowPlayingOptions from "../NowPlayingOptions.svelte";
  import PlayerControls from "../PlayerControls.svelte";
  import VolumeControls from "../VolumeControls.svelte";
  
  import FavoriteOff from "@ktibow/iconset-material-symbols/favorite-outline-rounded";
  import FavoriteOn from "@ktibow/iconset-material-symbols/favorite-rounded";
  import KeyboardArrowDown from "@ktibow/iconset-material-symbols/keyboard-arrow-down-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import QueueMusic from "@ktibow/iconset-material-symbols/queue-music-rounded";
  import { t } from "@stores/Locale";
  import ExtraControl from "../ExtraControl.svelte";
  
  let menuIsOpen = false;
  
  export let song: Song | undefined;
  $: songLength = song?.length ?? 0;
  export let isFavorited: boolean | undefined;
  export let toggleFavorite: () => void;
  export let topBackgroundColor: string;
  export let bottomBackgroundColor: string;

  $: label = song?.title ?? song?.fileName;
</script>

<div
  class="container"
  style:--top-background-color={topBackgroundColor}
  style:--bottom-background-color={bottomBackgroundColor}
>
  <div
    class="background"
    class:solid={$nowPlayingBackgroundType === NowPlayingBackgroundType.SOLID}
    class:gradient={$nowPlayingBackgroundType === NowPlayingBackgroundType.GRADIENT}
  />
  <div style="margin-top: 20px;">
    <DetailsArtPicture artPath={song?.artPath} />
  </div>
  <div class="content">
    <div class="song-info">
      <div class="title">
        {#if label && label.length > 28}
          <Marquee speed={40} gap={100}>{label}</Marquee>
        {:else}
          {label}
        {/if}
      </div>
      <div class="artist">{song?.artist ?? $t("UNKOWN_VALUE")}</div>
    </div>
    <div class="progress">
      <div class="side">{formatTime($songProgress)}</div> / <div class="side" style="justify-content: flex-end;">{formatTime(songLength)}</div>
    </div>
    <PlayerControls />
    <VolumeControls />
    <div class="options">
      <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={() => $showMiniPlayer = true}>
        <Icon icon={KeyboardArrowDown} />
      </Button>
      <div class="right">
        <ExtraControl size="3rem" iconSize="1.75rem" />
        <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={toggleFavorite}>
          {#if !isFavorited}
            <Icon icon={FavoriteOff} />
          {:else}
            <Icon icon={FavoriteOn} />
          {/if}
        </Button>
        <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={() => { $showQueue = true; $showMiniPlayer = true; }}>
          <Icon icon={QueueMusic} />
        </Button>
        <MenuButton icon={MoreVert} size="3rem" iconSize="1.75rem" bind:open={menuIsOpen}>
          <NowPlayingOptions bind:menuIsOpen={menuIsOpen} song={song} />
        </MenuButton>
      </div>
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

    position: absolute;
    bottom: 15px;

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
  }

  .title { font-weight: bold; max-width: 100%; }
  .artist { font-size: 18px; }

  .progress {
    margin-top: 10px;
    margin-bottom: 30px;

    display: flex;
    align-items: center;
  }

  .progress .side {
    width: 40px;
    display: flex;
  }

  .options {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 15px;
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
</style>