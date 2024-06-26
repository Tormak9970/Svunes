<script lang="ts">
  import { showVolumeControls, volumeLevel } from "../../../stores/State";
  import Slider from "../../interactables/Slider.svelte";
  import Icon from "../../utils/Icon.svelte";

  import VolumeDown from "@ktibow/iconset-material-symbols/volume-down-rounded";
  import VolumeUp from "@ktibow/iconset-material-symbols/volume-up-rounded";
</script>

<div class="volume-controls">
  {#if $showVolumeControls}
    <div class="volume-icon">
      <Icon icon={VolumeDown} height="30px" width="30px" />
    </div>
    <div style="flex-grow: 1; margin: 0px 10px;">
      <Slider min={0} max={1} showValue={false} trackHeight="0.25rem" bind:value={$volumeLevel} />
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