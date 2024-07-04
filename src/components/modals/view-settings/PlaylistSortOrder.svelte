<script lang="ts">
  import RadioInput from "@interactables/RadioInput.svelte";
  import { showPlaylistSortOrder } from "@stores/Modals";
  import { playlistSortOrder } from "@stores/State";
  import type { PlaylistSortOrder } from "../../../types/Settings";
  import SmallModalBody from "../utils/SmallModalBody.svelte";

  /**
   * Sets the playlist sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: PlaylistSortOrder) {
    $playlistSortOrder = order;
    $showPlaylistSortOrder = false;
  }
</script>

<SmallModalBody headline="Sort Order" bind:open={$showPlaylistSortOrder}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio">Alphabetical</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Song Count"} on:input={() => sortOrderChange("Song Count")} />
      <div class="radio">Track Count</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Most Played"} on:input={() => sortOrderChange("Most Played")} />
      <div class="radio">Most Played</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
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