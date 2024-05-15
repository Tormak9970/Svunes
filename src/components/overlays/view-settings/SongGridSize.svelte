<script lang="ts">
  import Body from "./Body.svelte";
  import { songGridSize } from "../../../stores/State";
  import { showSongGridSize } from "../../../stores/Overlays";
  import { GridSize } from "../../../types/Settings";
  import RadioInput from "../../interactables/RadioInput.svelte";

  /**
   * Sets the song grid size.
   * @param size The size to set to.
   */
  function gridSizeChange(size: GridSize) {
    $songGridSize = size;
    $showSongGridSize = false;
  }
</script>

<Body headline="Grid Size" open={$showSongGridSize}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="margin-bottom: 10px">
      <RadioInput name="gridSize" checked={$songGridSize === GridSize.LIST} on:input={() => gridSizeChange(GridSize.LIST)} />
      <div class="radio">List</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="gridSize" checked={$songGridSize === GridSize.LARGE} on:input={() => gridSizeChange(GridSize.LARGE)} />
      <div class="radio">Large</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="gridSize" checked={$songGridSize === GridSize.MEDIUM} on:input={() => gridSizeChange(GridSize.MEDIUM)} />
      <div class="radio">Medium</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="gridSize" checked={$songGridSize === GridSize.SMALL} on:input={() => gridSizeChange(GridSize.SMALL)} />
      <div class="radio">Small</div>
    </label>
  </div>
</Body>

<style>
  .content {
    display: flex;
    flex-direction: column;
  }

  label {
    display: flex;
    align-items: center;
  }

  .radio {
    margin-left: 15px;
    font-size: 16px;
  }
</style>