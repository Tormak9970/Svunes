<script lang="ts">
  import RadioInput from "@interactables/radio/RadioInput.svelte";
  import t from "@lib/utils/i18n";
  import { showPlaylistSortOrder } from "@stores/Modals";
  import { playlistSortOrder } from "@stores/State";
  import type { PlaylistSortOrder } from "../../../types/Settings";
  import SmallModalBody from "../utils/SmallModalBody.svelte";

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

<SmallModalBody headline={t("SORT_ORDER_TITLE")} open={open} on:close={() => open = false} on:closeEnd={() => $showPlaylistSortOrder = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio">{t("ALPHABETICAL_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Song Count"} on:input={() => sortOrderChange("Song Count")} />
      <div class="radio">{t("TRACK_COUNT_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Most Played"} on:input={() => sortOrderChange("Most Played")} />
      <div class="radio">{t("MOST_PLAYED_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="playlistSortOrder" checked={$playlistSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
      <div class="radio">{t("LAST_PLAYED_LABEL")}</div>
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