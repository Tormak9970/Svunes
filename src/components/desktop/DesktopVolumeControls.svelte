<script lang="ts">
  import { volumeLevel } from "@stores/State";

  import VerticalSlider from "@interactables/VerticalSlider.svelte";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="volume-controls">
  <VerticalSlider min={0} max={1} bind:value={$volumeLevel} />
</div>

<style>
  .volume-controls {
    height: fit-content;

    background-color: rgb(var(--m3-scheme-surface-container-lowest));
    padding: 0.5rem 0rem;

    border-radius: 10px;

    display: flex;
    align-items: center;
  }
</style>