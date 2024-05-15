<script lang="ts">
  import Body from "./Body.svelte";
  import { songSortOrder } from "../../../stores/State";
  import { showSongSortOrder } from "../../../stores/Overlays";
  import type { SongSortOrder } from "../../../types/Settings";
  import RadioInput from "../../interactables/RadioInput.svelte";

  /**
   * Sets the song sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: SongSortOrder) {
    $songSortOrder = order;
    $showSongSortOrder = false;
  }
</script>

<Body headline="Sort Order" open={$showSongSortOrder}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio">Alphabetical</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Album"} on:input={() => sortOrderChange("Album")} />
      <div class="radio">Album</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Artist"} on:input={() => sortOrderChange("Artist")} />
      <div class="radio">Artist</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Year"} on:input={() => sortOrderChange("Year")} />
      <div class="radio">Year</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="sortOrder" checked={$songSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
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