<script lang="ts">
  import RadioInput from "@interactables/RadioInput.svelte";
  import { showAlbumSortOrder } from "@stores/Modals";
  import { albumSortOrder } from "@stores/State";
  import type { AlbumSortOrder } from "../../../types/Settings";
  import Body from "./Body.svelte";

  /**
   * Sets the album sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: AlbumSortOrder) {
    $albumSortOrder = order;
    $showAlbumSortOrder = false;
  }
</script>

<Body headline="Sort Order" bind:open={$showAlbumSortOrder}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio">Alphabetical</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Artist"} on:input={() => sortOrderChange("Artist")} />
      <div class="radio">Artist</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Year"} on:input={() => sortOrderChange("Year")} />
      <div class="radio">Year</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Length"} on:input={() => sortOrderChange("Length")} />
      <div class="radio">Length</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Track Count"} on:input={() => sortOrderChange("Track Count")} />
      <div class="radio">Track Count</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Most Played"} on:input={() => sortOrderChange("Most Played")} />
      <div class="radio">Most Played</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
      <div class="radio">Last Played</div>
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