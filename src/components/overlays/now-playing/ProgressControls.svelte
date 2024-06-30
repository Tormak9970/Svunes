<script lang="ts">
  import Slider from "@interactables/Slider.svelte";
  import { formatTime } from "@lib/utils/Utils";
  import { songProgress } from "@stores/State";

  export let songLength: number;
  export let useTextColor = false;
</script>

<div class="slider-container">
  <div class="side">{formatTime($songProgress)}</div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div style="flex-grow: 1; margin: 0px 5px;" on:pointerdown|stopPropagation on:mousedown|stopPropagation on:touchstart|stopPropagation>
    <Slider min={0} max={songLength} trackColor={useTextColor ? "var(--m3-scheme-on-background)" : undefined} trackContainerColor={useTextColor ? "var(--m3-scheme-on-background) / 0.2" : undefined} trackHeight="0.25rem" bind:value={$songProgress} />
  </div>
  <div class="side" style="justify-content: flex-end;">{formatTime(songLength)}</div>
</div>

<style>
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
</style>