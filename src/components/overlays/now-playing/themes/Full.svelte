<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import Marquee from "@layout/Marquee.svelte";
  import type { Song } from "@lib/models/Song";
  import { showCarMode, showMiniPlayer } from "@stores/Overlays";
  import { showExtraSongInfo } from "@stores/State";
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
  <div class="background" />
  <div class="options">
    <Button type="text" iconType="full" size="3rem" iconSize="1.75rem" on:click={() => $showMiniPlayer = true}>
      <Icon icon={KeyboardArrowDown} />
    </Button>
    <Button type="text" iconType="full" on:click={() => $showCarMode = true}>
      <Icon icon={DirectionsCar} />
    </Button>
  </div>
  <div class="card-container">
    <div class="card" />
  </div>
  <div class="content">
    <div class="content-options">
      <Button type="text" iconType="full" on:click={toggleFavorite}>
        {#if !isFavorited}
          <Icon icon={FavoriteOff} />
        {:else}
          <Icon icon={FavoriteOn} />
        {/if}
      </Button>
      <div class="song-info">
        <div class="title">
          {#if song?.title.length && song?.title.length > 28}
            <div style="margin-left: 4%;">
              <Marquee speed={40} gap={100}>{song?.title}</Marquee>
            </div>
          {:else}
            {song?.title}
          {/if}
        </div>
        <div class="artist">{song?.artist ?? "Unkown"}</div>
      </div>
      <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
        <NowPlayingOptions bind:menuIsOpen={menuIsOpen} song={song} />
      </MenuButton>
    </div>
    <ProgressControls songLength={songLength} useTextColor />
    <PlayerControls useTextColor />
    <VolumeControls useTextColor />
    {#if $showExtraSongInfo}
      <div class="extra-info">{isMp3 ? "MP3" : "FLAC"} • {song?.displayFrequency()}</div>
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
    width: 100%;
    height: 100%;

    position: absolute;
    bottom: 0;
    
    box-shadow: 0px 2px 4px -1px rgb(var(--m3-scheme-shadow) / 0.2),
    0px 4px 5px 0px rgb(var(--m3-scheme-shadow) / 0.14),
    0px 1px 10px 0px rgb(var(--m3-scheme-shadow) / 0.12);
    
    z-index: 2;
  }

  .card {
    width: 100%;
    height: 100%;
    
    background-image: var(--converted-background-path);

    mask-image: linear-gradient(transparent, black 10%, black 40%, transparent);

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .content {
    width: calc(100% - 60px);
    height: 285px;
    padding: 0px 30px;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;

    bottom: 30px;

    z-index: 3;
  }

  .extra-info { font-size: 14px; opacity: 0.8; }

  .options {
    width: calc(100% - 10px);

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 10px;

    position: relative;
    z-index: 3;
  }

  .content-options {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 10px;
  }

  .options :global(svg), .content-options :global(svg) { color: rgb(var(--m3-scheme-on-background)); }

  .song-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    /* width: 50%; */

    font-size: 18px;

    gap: 10px;

    overflow: hidden;
  }

  .title {
    font-weight: bold;
    max-width: 100%;
    text-wrap: nowrap;
    font-size: 20px;
  }
  .artist {
    font-size: 14px;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .background {
    height: 100%;
    width: 100%;

    position: absolute;
    
    background: linear-gradient(rgb(var(--top-background-color) / 0.3), rgb(var(--bottom-background-color)));
  }
</style>