<script lang="ts">
  import RadioInput from "@interactables/radio/RadioInput.svelte";
  import { t } from "@stores/Locale";
  import { showAlbumSortOrder } from "@stores/Modals";
  import { albumSortOrder } from "@stores/State";
  import type { AlbumSortOrder } from "../../../types/Settings";
  import SmallModalBody from "../utils/SmallModalBody.svelte";

  let open = true;

  /**
   * Sets the album sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: AlbumSortOrder) {
    $albumSortOrder = order;
    $showAlbumSortOrder = false;
  }
</script>

<SmallModalBody headline={$t("SORT_ORDER_TITLE")} open={open} on:close={() => open = false} on:closeEnd={() => $showAlbumSortOrder = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio font-label">{$t("ALPHABETICAL_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Artist"} on:input={() => sortOrderChange("Artist")} />
      <div class="radio font-label">{$t("ARTIST_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Year"} on:input={() => sortOrderChange("Year")} />
      <div class="radio font-label">{$t("YEAR_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Length"} on:input={() => sortOrderChange("Length")} />
      <div class="radio font-label">{$t("LENGTH_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Track Count"} on:input={() => sortOrderChange("Track Count")} />
      <div class="radio font-label">{$t("TRACK_COUNT_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Most Played"} on:input={() => sortOrderChange("Most Played")} />
      <div class="radio font-label">{$t("MOST_PLAYED_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="albumSortOrder" checked={$albumSortOrder === "Last Played"} on:input={() => sortOrderChange("Last Played")} />
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