<script lang="ts">
  import { albumsMap, isPaused, nowPlayingBackgroundType, playingSongId, showExtraSongInfo, shuffle, repeatPlayed, songProgress, songsMap } from "../../../../stores/State";
  import { PlaybackController } from "../../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../../lib/controllers/QueueController";
  import { NowPlayingBackgroundType } from "../../../../types/Settings";
  import DetailsArtPicture from "../../../utils/DetailsArtPicture.svelte";
  import { tauri } from "@tauri-apps/api";
  import Slider from "../../../interactables/Slider.svelte";
  import { formatTime } from "../../../../lib/utils/Utils";
  import Marquee from "../../../layout/Marquee.svelte";
  import Button from "../../../interactables/Button.svelte";
  import Icon from "../../../utils/Icon.svelte";
  
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import SkipPrevious from "@ktibow/iconset-material-symbols/skip-previous-rounded";
  import SkipNext from "@ktibow/iconset-material-symbols/skip-next-rounded";
  import Repeat from "@ktibow/iconset-material-symbols/repeat-rounded";
  
  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;
  $: album = song?.album ? $albumsMap[song?.album] : undefined;
  
  $: convertedPath = song?.artPath ? tauri.convertFileSrc(song?.artPath) : "";

  $: isMp3 = song?.fileName.toLocaleLowerCase().endsWith("mp3");
  $: songLength = song?.length ?? 0;

  $: topBackgroundColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
  const bottomBackgroundColor = "var(--m3-scheme-background)";

  $: marqueeColor =
    $nowPlayingBackgroundType === NowPlayingBackgroundType.SOLID ?
    "var(--m3-scheme-background)" : (
      $nowPlayingBackgroundType === NowPlayingBackgroundType.GRADIENT ?
      "none" :
      "var(--m3-scheme-surface-container)"
    );
    
  function handlePlay() {
    if ($isPaused) {
      PlaybackController.resume();
    } else {
      PlaybackController.pause();
    }
  }
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
    <div class="progress-container">
      <div class="time">{formatTime($songProgress)}</div>
      <div style="flex-grow: 1; margin: 0px 5px;">
        <Slider min={0} max={songLength} showValue={false} trackHeight="0.25rem" bind:value={$songProgress} />
      </div>
      <div class="time" style="justify-content: flex-end;">{formatTime(songLength)}</div>
    </div>
    <div class="song-info">
      <div class="title">
        {#if song?.title.length && song?.title.length > 28}
          <Marquee speed={40} gap={100} gradientColor={marqueeColor}>{song?.title}</Marquee>
        {:else}
          {song?.title}
        {/if}
      </div>
      <div class="artist">{song?.artist ?? "Unkown"}</div>
      {#if $showExtraSongInfo}
        <div class="extra-info">{isMp3 ? "MP3" : "FLAC"} • {song?.displayFrequency()}</div>
      {/if}
    </div>
    <div class="controls">
      <Button type="text" iconType="full" on:click={() => $repeatPlayed = !$repeatPlayed }>
        <div class="wrapper" style:color={$repeatPlayed ? "rgb(var(--m3-scheme-primary))" : "rgb(var(--m3-scheme-outline-variant))"}>
          <Icon icon={Repeat} />
        </div>
      </Button>
      <Button type="text" iconType="full" on:click={QueueController.skipBack}>
        <Icon icon={SkipPrevious} />
      </Button>
      <Button type="filled" iconType="full" on:click={handlePlay}>
        {#if !$isPaused}
          <Icon icon={Pause} />
        {:else}
          <Icon icon={Play} />
        {/if}
      </Button>
      <Button type="text" iconType="full" on:click={QueueController.skip}>
        <Icon icon={SkipNext} />
      </Button>
      <Button type="text" iconType="full" extraOptions={{ style: "display: flex;" }} on:click={() => $shuffle = !$shuffle }>
        <div class="wrapper" style:color={$shuffle ? "rgb(var(--m3-scheme-primary))" : "rgb(var(--m3-scheme-outline-variant))"}>
          <Icon icon={Shuffle} />
        </div>
      </Button>
    </div>
    <div class="volume">

    </div>
  </div>
  <div class="options">
    
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

  .progress-container {
    width: 100%;
    margin-top: 20px;

    display: flex;
    align-items: center;
  }

  .progress-container .time {
    width: 45px;
    display: flex;
  }

  .song-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    width: 100%;

    margin: 20px 0px;
    gap: 20px;

    font-size: 24px;

    height: 150px;
  }

  .title { font-weight: bold; max-width: 100%; }
  .artist { font-size: 18px; }
  .extra-info { font-size: 14px; opacity: 0.8; }

  .controls {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .wrapper {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
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

    filter: blur(20px);
    -webkit-filter: blur(20px) brightness(0.8);

    height: 100%;

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>