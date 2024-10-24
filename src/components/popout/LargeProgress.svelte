<script lang="ts">
  import { Slider } from "@interactables";
  import { songProgressPopout } from "@stores/Popout";
  import { formatTime } from "@utils";

  export let songLength: number;
</script>

<div class="side font-body-medium" style="left: 5px">{formatTime($songProgressPopout)}</div>
<div class="slider-container">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div style="flex-grow: 1; margin: 0px 5px;" on:pointerdown|stopPropagation on:mousedown|stopPropagation>
    <Slider min={0} max={songLength} trackColor="var(--m3-scheme-on-background)" trackContainerColor="var(--m3-scheme-on-background) / 0.2" trackHeight="0.25rem" thumbSize="0.5rem" trackGap="0.4rem" bind:value={$songProgressPopout} />
  </div>
</div>
<div class="side font-body-medium" style="right: 2px">{formatTime(songLength)}</div>

<style>
  .slider-container {
    position: absolute;

    width: 100%;

    display: flex;
    align-items: center;

    bottom: -15px;
  }

  .side {
    position: absolute;
    width: 30px;
    display: flex;
    color: rgb(var(--m3-scheme-on-background) / 0.6);

    bottom: 15px;
  }
</style>