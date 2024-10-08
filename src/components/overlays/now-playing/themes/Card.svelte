<script lang="ts">
  import { Icon } from "@component-utils";
  import { Button, MenuButton } from "@interactables";
  import { Marquee } from "@layout";
  import type { Song } from "@models";
  import { showMiniPlayer } from "@stores/Overlays";
  import { nowPlayingBackgroundType, showExtraSongInfo } from "@stores/State";
  import { NowPlayingBackgroundType } from "@types";
  import NowPlayingOptions from "../NowPlayingOptions.svelte";
  import PlayerControls from "../PlayerControls.svelte";
  import ProgressControls from "../ProgressControls.svelte";
  import VolumeControls from "../VolumeControls.svelte";

  import { FavoriteOff, FavoriteOn, KeyboardArrowDown, MoreVert, QueueMusic } from "@icons";
  import { t } from "@stores/Locale";
  import { goToQueue } from "@utils";
  import ExtraControl from "../ExtraControl.svelte";
  
  let menuIsOpen = false;
  
  export let song: Song | undefined;
  $: songLength = song?.length ?? 0;
  export let isMp3: boolean | undefined;
  export let isFavorited: boolean | undefined;
  export let toggleFavorite: () => void;
  export let convertedPath: string;
  export let topBackgroundColor: string;
  export let bottomBackgroundColor: string;

  $: label = song?.title ?? song?.fileName;
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
  <div class="options">
    <div class="options-side">
      <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={() => $showMiniPlayer = true}>
        <Icon icon={KeyboardArrowDown} />
      </Button>
      <div class="song-info">
        <div class="font-label-large title">
          {#key label}
            <Marquee speed={35} gap={100}>{label}</Marquee>
          {/key}
        </div>
        <div class="font-body-medium artist">{song?.artist ?? $t("UNKOWN_VALUE")}</div>
      </div>
    </div>
    <div class="options-side" style="justify-content: flex-end; margin-right: 5px;">
      <ExtraControl />
      <Button type="text" iconType="full" on:click={toggleFavorite}>
        {#if !isFavorited}
          <Icon icon={FavoriteOff} />
        {:else}
          <Icon icon={FavoriteOn} />
        {/if}
      </Button>
      <Button type="text" iconType="full" on:click={() => { goToQueue(); $showMiniPlayer = true; }}>
        <Icon icon={QueueMusic} />
      </Button>
      <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
        <NowPlayingOptions bind:menuIsOpen={menuIsOpen} song={song} />
      </MenuButton>
    </div>
  </div>
  <div class="card-container">
    <div class="card" />
  </div>
  <div class="content">
    <VolumeControls useTextColor />
    <PlayerControls useTextColor />
    <ProgressControls songLength={songLength} useTextColor />
    {#if $showExtraSongInfo}
      <div class="font-body-medium">{isMp3 ? "MP3" : "FLAC"} • {song?.displayFrequency()}</div>
    {/if}
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

  .card-container {
    width: calc(100% - 30px);
    height: calc(100% - 88px);
    margin: 15px 0px;

    position: absolute;
    bottom: 0;

    border-radius: 20px;
    overflow: hidden;
    
    box-shadow: 0px 2px 4px -1px rgb(var(--m3-scheme-shadow) / 0.2),
    0px 4px 5px 0px rgb(var(--m3-scheme-shadow) / 0.14),
    0px 1px 10px 0px rgb(var(--m3-scheme-shadow) / 0.12);
    
    z-index: 2;
  }

  .card {
    width: 100%;
    height: 100%;
    
    background-image: var(--converted-background-path);

    mask-image: linear-gradient(black 40%, transparent);

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .content {
    width: calc(100% - 60px);
    max-width: 370px;
    height: 219px;
    padding: 0px 30px;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;

    bottom: 30px;

    z-index: 3;
  }

  .options {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 10px;

    position: relative;
    z-index: 2;
  }

  .options-side {
    display: flex;
    align-items: center;
    width: 50%;
  }

  .options-side :global(svg) { color: rgb(var(--m3-scheme-on-background)); }

  .song-info {
    display: flex;
    flex-direction: column;
    
    width: calc(100% - 53px);

    margin-left: 5px;
  }

  .title {
    font-weight: bold;
    width: 100%;
    text-wrap: nowrap;
  }
  .artist {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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