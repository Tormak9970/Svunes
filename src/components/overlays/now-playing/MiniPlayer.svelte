<script lang="ts">
  import { fly } from "svelte/transition";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { isPaused, playingSongId, songProgress, songsMap } from "../../../stores/State";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import Icon from "../../utils/Icon.svelte";
  import Button from "../../interactables/Button.svelte";
  import ViewImage from "../../utils/ViewImage.svelte";
  import { tauri } from "@tauri-apps/api";

  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;

  $: covertedPath = song?.artPath ? tauri.convertFileSrc(song.artPath) : ""; 

  $: progressWidth = song ? $songProgress / song.length * 100 : 0;
  
  const backgroundColor = "var(--m3-scheme-surface-container-low)";
  const textColor = "var(--m3-scheme-primary)";

  // ? swipe up to show now-playing (will need transition)
  // ? tap to view show now-playing (will need transition)
  // ? swipe down to clear nowPlaying stores

  // ? swipe left to skip back
  // ? swipe right to skip

  function handlePlay() {
    if ($isPaused) {
      PlaybackController.resume();
    } else {
      PlaybackController.pause();
    }
  }
</script>

<div class="holder" in:fly={{ y: 100, duration: 300 }} out:fly={{ y: 100, duration: 400 }} style:--background-color={backgroundColor} style:--text-color={textColor}>
  <div class="m3-container">
    <ViewImage src={covertedPath} width={30} height={30} borderRadius="4px" />
    <p class="m3-font-body-medium">{song?.title}</p>
    <Button type="text" iconType="full" on:click={handlePlay}>
      {#if !$isPaused}
        <Icon icon={Pause} />
      {:else}
        <Icon icon={Play} />
      {/if}
    </Button>
  </div>
  <div class="progress" style:width="{progressWidth}%" />
</div>

<style>
  .holder {
    border: 0;
    padding: 0;

    width: 100%;

    position: relative;

    background-color: transparent;
    z-index: 3;
  }
  p {
    margin-left: 0.5rem;
    margin-right: auto;
  }

  .holder::backdrop {
    display: none;
  }

  .m3-container {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    min-width: 20rem;
    max-width: 60rem;
    min-height: 3rem;
    border-radius: 10px 10px 0px 0px;
    background-color: rgb(var(--background-color));
    color: rgb(var(--text-color));
    overflow: hidden;

    padding-bottom: 2px;
  }

  .progress {
    position: absolute;
    border-radius: 0px 2px 2px 0px;
    height: 4px;

    left: 0px;
    bottom: 0px;
    
    background-color: rgb(var(--text-color));
    transition: width 0.2s;
  }
</style>