<script lang="ts">
  import { onMount } from "svelte";
  import { tauri } from "@tauri-apps/api";
  import { albumsMap, nowPlayingBackgroundType, playingSongId, showExtraSongInfo, songProgress, songsMap, playlists } from "../../../../stores/State";
  import { showCarMode, showMiniPlayer, showQueue } from "../../../../stores/Overlays";
  import { NowPlayingBackgroundType } from "../../../../types/Settings";
  import DetailsArtPicture from "../../../utils/DetailsArtPicture.svelte";
  import Slider from "../../../interactables/Slider.svelte";
  import { formatTime } from "../../../../lib/utils/Utils";
  import Marquee from "../../../layout/Marquee.svelte";
  import Button from "../../../interactables/Button.svelte";
  import Icon from "../../../utils/Icon.svelte";
  import MenuButton from "../../../interactables/MenuButton.svelte";
  import NowPlayingOptions from "../NowPlayingOptions.svelte";
  import PlayerControls from "../PlayerControls.svelte";
  import VolumeControls from "../VolumeControls.svelte";

  import Collapse from "@ktibow/iconset-material-symbols/keyboard-arrow-down-rounded";
  import CarMode from "@ktibow/iconset-material-symbols/directions-car-outline-rounded";
  import FavoriteOff from "@ktibow/iconset-material-symbols/favorite-outline-rounded";
  import FavoriteOn from "@ktibow/iconset-material-symbols/favorite-rounded";
  import Queue from "@ktibow/iconset-material-symbols/queue-music-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  
  let menuIsOpen = false;
  
  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;
  $: album = song?.album ? $albumsMap[song?.album] : undefined;

  $: favoritesPlaylist = $playlists.find((playlist) => playlist.name === "Favorites");
  $: isFavorited = song?.id ? favoritesPlaylist?.songIds.includes(song?.id) : false;
  
  $: convertedPath = song?.artPath ? tauri.convertFileSrc(song?.artPath) : "";

  $: isMp3 = song?.fileName.toLocaleLowerCase().endsWith("mp3");
  $: songLength = song?.length ?? 0;

  $: topBackgroundColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
  const bottomBackgroundColor = "var(--m3-scheme-background)";

  function toggleFavorite() {
    if (isFavorited) {
      const index = favoritesPlaylist?.songIds.indexOf(song!.id)!;
      favoritesPlaylist?.songIds.splice(index, 1);
    } else {
      favoritesPlaylist?.songIds.push(song!.id);
    }
    
    $playlists = [ ...$playlists ];
  }

  onMount(async () => {
    if (album && topBackgroundColor === "var(--m3-scheme-surface-container-low)") {
      await album.setBackgroundFromImage();
      topBackgroundColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
    }
  });
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
        <Icon icon={Collapse} />
      </Button>
      <div class="song-info">
        <div class="title">
          {#if song?.title.length && song?.title.length > 16}
            <Marquee speed={35} gap={100}>{song?.title}</Marquee>
          {:else}
            {song?.title}
          {/if}
        </div>
        <div class="artist">{song?.artist ?? "Unkown"}</div>
      </div>
    </div>
    <div class="options-side" style="justify-content: flex-end; margin-right: 5px;">
      <Button type="text" iconType="full" on:click={() => $showCarMode = true}>
        <Icon icon={CarMode} />
      </Button>
      <Button type="text" iconType="full" on:click={toggleFavorite}>
        {#if !isFavorited}
          <Icon icon={FavoriteOff} />
        {:else}
          <Icon icon={FavoriteOn} />
        {/if}
      </Button>
      <Button type="text" iconType="full" on:click={() => $showQueue = true}>
        <Icon icon={Queue} />
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
    <PlayerControls />
    <div class="slider-container">
      <div class="side">{formatTime($songProgress)}</div>
      <div style="flex-grow: 1; margin: 0px 5px;">
        <Slider min={0} max={songLength} showValue={false} trackColor={"var(--m3-scheme-on-background)"} trackContainerColor={"var(--m3-scheme-on-background) / 0.2"} trackHeight="0.25rem" bind:value={$songProgress} />
      </div>
      <div class="side" style="justify-content: flex-end;">{formatTime(songLength)}</div>
    </div>
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
    height: 219px;
    padding: 0px 30px;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;

    bottom: 30px;

    z-index: 3;
  }

  .slider-container {
    width: 100%;
    margin-top: 20px;

    display: flex;
    align-items: center;
  }

  .slider-container .side {
    width: 45px;
    display: flex;
  }

  .extra-info { font-size: 14px; }

  .options {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-top: 10px;
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

    font-size: 18px;

    margin-left: 5px;

    overflow: hidden;
  }

  .title {
    font-weight: bold;
    max-width: 100%;
    text-wrap: nowrap;
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