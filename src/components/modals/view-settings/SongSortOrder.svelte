<script lang="ts">
  import RadioInput from "@interactables/radio/RadioInput.svelte";
  import { showSongSortOrder } from "@stores/Modals";
  import { songSortOrder } from "@stores/State";
  import type { SongSortOrder } from "../../../types/Settings";
  import SmallModalBody from "../utils/SmallModalBody.svelte";

  let open = true;

  /**
   * Sets the song sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: SongSortOrder) {
    $songSortOrder = order;
    $showSongSortOrder = false;
  }
</script>

<SmallModalBody headline="Sort Order" open={open} on:close={() => open = false} on:closeEnd={() => $showSongSortOrder = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio">Alphabetical</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Album"} on:input={() => sortOrderChange("Album")} />
      <div class="radio">Album</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Artist"} on:input={() => sortOrderChange("Artist")} />
      <div class="radio">Artist</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Year"} on:input={() => sortOrderChange("Year")} />
      <div class="radio">Year</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Most Played"} on:input={() => sortOrderChange("Most Played")} />
      <div class="radio">Most Played</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
      <div class="radio">Last Played</div>
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