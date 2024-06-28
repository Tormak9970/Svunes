<script lang="ts">
  import { showVolumeControls, volumeLevel } from "../../../stores/State";
  import Slider from "../../interactables/Slider.svelte";
  import Icon from "../../utils/Icon.svelte";

  import VolumeDown from "@ktibow/iconset-material-symbols/volume-down-rounded";
  import VolumeUp from "@ktibow/iconset-material-symbols/volume-up-rounded";

  export let useTextColor = false;
</script>

<div class="volume-controls">
  {#if $showVolumeControls}
    <div class="volume-icon">
      <Icon icon={VolumeDown} height="30px" width="30px" />
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div style="flex-grow: 1; margin: 0px 10px;" on:pointerdown|stopPropagation on:mousedown|stopPropagation on:touchstart|stopPropagation>
      <Slider min={0} max={1} showValue={false} trackColor={useTextColor ? "var(--m3-scheme-on-background)" : undefined} trackContainerColor={useTextColor ? "var(--m3-scheme-on-background) / 0.2" : undefined} trackHeight="0.25rem" bind:value={$volumeLevel} />
    </div>
    <div class="volume-icon">
      <Icon icon={VolumeUp} height="30px" width="30px" />
    </div>
  {/if}
</div>

<style>
  .volume-controls {
    width: 100%;
    height: 44px;
    margin-top: 20px;

    display: flex;
    align-items: center;
  }

  .volume-controls .volume-icon {
    width: 50px;
    display: flex;
    justify-content: center;
  }
</style>