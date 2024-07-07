<script lang="ts">
  import { View } from "../../../types/View";

  import RadioInput from "@interactables/RadioInput.svelte";
  import { showGridSize } from "@stores/Modals";
  import { albumGridSize, artistGridSize, playlistGridSize, selectedView, songGridSize } from "@stores/State";
  import { GridSize } from "../../../types/Settings";
  import SmallModalBody from "../utils/SmallModalBody.svelte";

  $: gridSize = $selectedView === View.PLAYLISTS ? $playlistGridSize : ($selectedView === View.ALBUMS ? $albumGridSize : ($selectedView === View.SONGS ? $songGridSize : $artistGridSize));

  /**
   * Sets the song grid size.
   * @param size The size to set to.
   */
  function gridSizeChange(size: GridSize) {
    switch($selectedView) {
      case View.PLAYLISTS:
        $playlistGridSize = size;
        break;
      case View.ALBUMS:
        $albumGridSize = size;
        break;
      case View.SONGS:
        $songGridSize = size;
        break;
      case View.ARTISTS:
        $artistGridSize = size;
        break;
      default:
        break;
    }
    
    $showGridSize = false;
  }
</script>

<SmallModalBody headline="Grid Size" open on:close={() => $showGridSize = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="gridSize" checked={gridSize === GridSize.LARGE} on:input={() => gridSizeChange(GridSize.LARGE)} />
      <div class="radio">Large</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="gridSize" checked={gridSize === GridSize.MEDIUM} on:input={() => gridSizeChange(GridSize.MEDIUM)} />
      <div class="radio">Medium</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="gridSize" checked={gridSize === GridSize.LIST} on:input={() => gridSizeChange(GridSize.LIST)} />
      <div class="radio">List</div>
    </label>
  </div>
</SmallModalBody>

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