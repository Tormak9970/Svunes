<script lang="ts">
  import RadioInput from "@interactables/radio/RadioInput.svelte";
  import { t } from "@stores/Locale";
  import { showArtistSortOrder } from "@stores/Modals";
  import { artistSortOrder } from "@stores/State";
  import type { ArtistSortOrder } from "@types";
  import SmallModalBody from "../utils/SmallModalBody.svelte";

  let open = true;

  /**
   * Sets the artist sort order.
   * @param order The sort order to set to.
   */
  function sortOrderChange(order: ArtistSortOrder) {
    $artistSortOrder = order;
    $showArtistSortOrder = false;
  }
</script>

<SmallModalBody headline={$t("SORT_ORDER_TITLE")} open={open} on:close={() => open = false} on:closeEnd={() => $showArtistSortOrder = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    <label style="height: 2.5rem;">
      <RadioInput name="artistSortOrder" checked={$artistSortOrder === "Alphabetical"} on:input={() => sortOrderChange("Alphabetical")} />
      <div class="radio font-label">{$t("ALPHABETICAL_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="artistSortOrder" checked={$artistSortOrder === "Album Count"} on:input={() => sortOrderChange("Album Count")} />
      <div class="radio font-label">{$t("ALBUM_COUNT_LABEL")}</div>
    </label>
    <label style="height: 2.5rem;">
      <RadioInput name="artistSortOrder" checked={$artistSortOrder === "Track Count"} on:input={() => sortOrderChange("Track Count")} />
      <div class="radio font-label">{$t("TRACK_COUNT_LABEL")}</div>
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