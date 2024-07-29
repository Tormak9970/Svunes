<script lang="ts">
  import RadioInput from "@interactables/radio/RadioInput.svelte";
  import { t } from "@stores/Locale";
  import { showSongSortOrder } from "@stores/Modals";
  import { songSortOrder } from "@stores/State";
  import type { SongSortOrder } from "@types";
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

<SmallModalBody headline={$t("SORT_ORDER_TITLE")} open={open} on:close={() => open = false} on:closeEnd={() => $showSongSortOrder = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio font-label">{$t("ALPHABETICAL_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Album"} on:input={() => sortOrderChange("Album")} />
      <div class="radio font-label">{$t("ALBUM_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Artist"} on:input={() => sortOrderChange("Artist")} />
      <div class="radio font-label">{$t("ARTIST_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Year"} on:input={() => sortOrderChange("Year")} />
      <div class="radio font-label">{$t("YEAR_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Most Played"} on:input={() => sortOrderChange("Most Played")} />
      <div class="radio font-label">{$t("MOST_PLAYED_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="songSortOrder" checked={$songSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
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