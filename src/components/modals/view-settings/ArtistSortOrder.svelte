<script lang="ts">
  import RadioInput from "@interactables/radio/RadioInput.svelte";
  import { showArtistSortOrder } from "@stores/Modals";
  import { artistSortOrder } from "@stores/State";
  import type { ArtistSortOrder } from "../../../types/Settings";
  import SmallModalBody from "../utils/SmallModalBody.svelte";

  /**
   * Sets the artist sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: ArtistSortOrder) {
    $artistSortOrder = order;
    $showArtistSortOrder = false;
  }
</script>

<SmallModalBody headline="Sort Order" open on:close={() => $showArtistSortOrder = false}>
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