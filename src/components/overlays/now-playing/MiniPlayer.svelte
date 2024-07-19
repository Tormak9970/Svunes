<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import ViewImage from "@component-utils/ViewImage.svelte";
  import Button from "@interactables/Button.svelte";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import PlayArrow from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Marquee from "@layout/Marquee.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import { showMiniPlayer, showNowPlaying, showQueue } from "@stores/Overlays";
  import { isPaused, playingSongId, songProgress, songsMap } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { onDestroy } from "svelte";

  export let clampedHeight: number;
  export let hasDragged: boolean;

  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;

  $: covertedPath = song?.artPath ? convertFileSrc(song.artPath) : ""; 

  $: progressWidth = song ? $songProgress / song.length * 100 : 0;

  $: label = song?.title ?? song?.fileName;

  function handlePlay() {
    if ($isPaused) {
      PlaybackController.resume();
    } else {
      PlaybackController.pause();
    }
  }

  function handleClick() {
    if (!hasDragged) {
      $showMiniPlayer = false;
      $showQueue = false;
    } else {
      hasDragged = false;
    }
  }

  onDestroy(() => {
    if (!$showNowPlaying) PlaybackController.resetNowPlaying();
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="holder" style:opacity={(clampedHeight + 20) / 20} on:click={handleClick}>
  <div class="m3-container">
    <ViewImage src={covertedPath} width={30} height={30} borderRadius="4px" />
    <div class="text-container">
      {#key label}
        <Marquee speed={40} gap={100}>
          <p class="m3-font-body-medium font-label">{label}</p>
        </Marquee>
      {/key}
    </div>
    <div style="touch-action: auto;">
      <Button type="text" iconType="full" on:click={handlePlay}>
        {#if !$isPaused}
          <Icon icon={Pause} />
        {:else}
          <Icon icon={PlayArrow} />
        {/if}
      </Button>
    </div>
  </div>
  <div class="progress-container">
    <div class="progress" style:width="{progressWidth}%" />
  </div>
</div>

<style>
  .holder {
    border: 0;
    padding: 0;

    position: absolute;
    top: 0;

    margin: 0px 8px;
    width: calc(100% - 16px);
    height: fit-content;

    overflow: hidden;

    background-color: transparent;
    
    border-radius: 10px;
    
    box-shadow: 0px 2px 4px -1px rgb(var(--m3-scheme-shadow) / 0.2),
    0px 4px 5px 0px rgb(var(--m3-scheme-shadow) / 0.14),
    0px 1px 10px 0px rgb(var(--m3-scheme-shadow) / 0.12);

    z-index: 2;

    cursor: pointer;
  }
  p {
    margin-left: 0.5rem;
    margin-right: auto;
  }

  .holder::backdrop {
    display: none;
  }

  .text-container {
    width: 66%;
    margin-right: 10%;
    margin-left: 2%;
  }

  .text-container p {
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    margin-left: 8px;
  }

  .m3-container {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    min-width: 20rem;
    max-width: 60rem;
    min-height: 3rem;
    background-color: rgb(var(--m3-scheme-surface-container-low));
    color: rgb(var(--m3-scheme-primary));

    height: 50px;

    padding-bottom: 2px;
  }

  .progress-container {
    position: absolute;
    
    height: 4px;
    
    left: 0.5rem;
    bottom: 0px;

    width: calc(100% - 1rem);
  }

  .progress {
    border-radius: 2px;

    height: 100%;
    
    background-color: rgb(var(--m3-scheme-primary));
    transition: width 0.2s;
  }
</style>