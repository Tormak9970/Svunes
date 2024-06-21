<script lang="ts">
  import { albumsMap, isPaused, nowPlayingBackgroundType, nowPlayingUseAlbumColors, playingSongId, showExtraSongInfo, songProgress, songsMap } from "../../../../stores/State";
  import { PlaybackController } from "../../../../lib/controllers/PlaybackController";
  import { NowPlayingBackgroundType } from "../../../../types/Settings";
  import DetailsArtPicture from "../../../utils/DetailsArtPicture.svelte";
  import { tauri } from "@tauri-apps/api";
    import Slider from "../../../interactables/Slider.svelte";
    import { formatTime } from "../../../../lib/utils/Utils";
  
  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;
  $: album = song?.album ? $albumsMap[song?.album] : undefined;
  
  $: convertedPath = song?.artPath ? tauri.convertFileSrc(song?.artPath) : "";

  $: isMp3 = song?.fileName.toLocaleLowerCase().endsWith("mp3");
  $: songLength = song?.length ?? 0;

  $: progressWidth = song ? $songProgress / song.length * 100 : 0;
  $: topBackgroundColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
  const bottomBackgroundColor = "var(--m3-scheme-background)";

  function handleSliderInput(value: number) {

  }
  
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
  style:--top-background-color={$nowPlayingUseAlbumColors ? topBackgroundColor : bottomBackgroundColor}
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
      <div>{formatTime($songProgress)}</div>
      <Slider min={0} max={songLength} showValue={false} bind:value={$songProgress} />
      <div>{formatTime(songLength)}</div>
    </div>
    <div class="song-info">
      <div class="title">{song?.title}</div>
      <div class="artist">{song?.artist ?? "Unkown"}</div>
      {#if $showExtraSongInfo}
        <div class="extra-info">{isMp3 ? "MP3" : "FLAC"} • {song?.displayFrequency()}</div>
      {/if}
    </div>
    <div class="controls">

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
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
    z-index: 2;
  }

  .progress-container {
    width: 100%;

    display: flex;
    align-items: center;
  }

  .song-info {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 20px 0px;
    gap: 20px;

    font-size: 24px;

    height: 150px;
  }

  .title { font-weight: bold; }
  .artist { font-size: 18px; }
  .extra-info { font-size: 14px; opacity: 0.8; }

  .background {
    height: 100%;
    width: 100%;

    position: absolute;
  }

  .background.solid {
    background: rgb(var(--top-background-color) / 0.3);
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