<script lang="ts">
  import Body from "./Body.svelte";
  import { artistSortOrder } from "../../../stores/State";
  import { showArtistSortOrder } from "../../../stores/Modals";
  import RadioInput from "../../interactables/RadioInput.svelte";
  import type { ArtistSortOrder } from "../../../types/Settings";

  /**
   * Sets the artist sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: ArtistSortOrder) {
    $artistSortOrder = order;
    $showArtistSortOrder = false;
  }
</script>

<Body headline="Sort Order" bind:open={$showArtistSortOrder}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="artistSortOrder" checked={$artistSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio">Alphabetical</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="artistSortOrder" checked={$artistSortOrder === "Album Count"} on:input={() => sortOrderChange("Album Count")} />
      <div class="radio">Album Count</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="artistSortOrder" checked={$artistSortOrder === "Track Count"} on:input={() => sortOrderChange("Track Count")} />
      <div class="radio">Track Count</div>
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