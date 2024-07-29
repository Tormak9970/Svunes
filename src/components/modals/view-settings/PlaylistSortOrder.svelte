<script lang="ts">
  import { SmallModalBody } from "@component-utils";
  import { RadioInput } from "@interactables";
  import { t } from "@stores/Locale";
  import { showPlaylistSortOrder } from "@stores/Modals";
  import { playlistSortOrder } from "@stores/State";
  import type { PlaylistSortOrder } from "@types";

  let open = true;

  /**
   * Sets the playlist sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: PlaylistSortOrder) {
    $playlistSortOrder = order;
    $showPlaylistSortOrder = false;
  }
</script>

<SmallModalBody headline={$t("SORT_ORDER_TITLE")} open={open} on:close={() => open = false} on:closeEnd={() => $showPlaylistSortOrder = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio font-label">{$t("ALPHABETICAL_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Song Count"} on:input={() => sortOrderChange("Song Count")} />
      <div class="radio font-label">{$t("TRACK_COUNT_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Most Played"} on:input={() => sortOrderChange("Most Played")} />
      <div class="radio font-label">{$t("MOST_PLAYED_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
      <div class="radio font-label">{$t("LAST_PLAYED_LABEL")}</div>
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
    margin-left: 5px;
  }
</style>