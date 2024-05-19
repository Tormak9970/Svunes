<script lang="ts">
  import Body from "./Body.svelte";
  import { playlistSortOrder } from "../../../stores/State";
  import { showPlaylistSortOrder } from "../../../stores/Modals";
  import RadioInput from "../../interactables/RadioInput.svelte";
  import type { PlaylistSortOrder } from "../../../types/Settings";

  /**
   * Sets the playlist sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: PlaylistSortOrder) {
    $playlistSortOrder = order;
    $showPlaylistSortOrder = false;
  }
</script>

<Body headline="Sort Order" bind:open={$showPlaylistSortOrder}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="margin-bottom: 10px">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio">Alphabetical</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Song Count"} on:input={() => sortOrderChange("Song Count")} />
      <div class="radio">Track Count</div>
    </label>
    <label style="margin-bottom: 10px">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
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