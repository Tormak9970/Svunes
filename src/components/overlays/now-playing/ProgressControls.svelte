<script lang="ts">
  import { formatTime } from "../../../lib/utils/Utils";
  import { songProgress } from "../../../stores/State";
  import Slider from "../../interactables/Slider.svelte";

  export let songLength: number;
  export let useTextColor = false;
</script>

<div class="slider-container">
  <div class="side">{formatTime($songProgress)}</div>
  <div style="flex-grow: 1; margin: 0px 5px;">
    <Slider min={0} max={songLength} showValue={false} trackColor={useTextColor ? "var(--m3-scheme-on-background)" : undefined} trackContainerColor={useTextColor ? "var(--m3-scheme-on-background) / 0.2" : undefined} trackHeight="0.25rem" bind:value={$songProgress} />
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