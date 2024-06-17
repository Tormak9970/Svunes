<script lang="ts">
  import { fly } from "svelte/transition";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { albumsMap, isPaused, playingSongId, showViewNav, songProgress, songsMap } from "../../../stores/State";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import Icon from "../../utils/Icon.svelte";
  import Button from "../../interactables/Button.svelte";
  import ViewImage from "../../utils/ViewImage.svelte";
  import { tauri } from "@tauri-apps/api";

  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;
  $: album = song?.album ? $albumsMap[song?.album] : undefined;

  $: covertedPath = song?.artPath ? tauri.convertFileSrc(song.artPath) : ""; 

  $: progressWidth = song ? $songProgress / song.length * 100 : 0;
  
  $: progressColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-primary)";

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

<div class="holder" in:fly={{ y: 100, duration: 300 }} out:fly={{ y: 100, duration: 400 }} style:--progress-color={progressColor} style:--text-color={"var(--m3-scheme-primary)"} style:bottom={$showViewNav ? "65px" : "10px"}>
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
  <div class="progress-container">
    <div class="progress" style:width="{progressWidth}%" />
  </div>
</div>

<style>
  .holder {
    border: 0;
    padding: 0;

    width: calc(100% - 16px);
    height: fit-content;

    position: absolute;
    overflow: hidden;

    background-color: transparent;
    z-index: 3;
    
    border-radius: 10px;
    
    box-shadow: 0px 2px 4px -1px rgb(var(--m3-scheme-shadow) / 0.2),
    0px 4px 5px 0px rgb(var(--m3-scheme-shadow) / 0.14),
    0px 1px 10px 0px rgb(var(--m3-scheme-shadow) / 0.12);

    transition: bottom 0.2s ease-out;
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
    background-color: rgb(var(--m3-scheme-surface-container-low));
    color: rgb(var(--text-color));

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
    
    background-color: rgb(var(--progress-color));
    transition: width 0.2s;
  }
</style>