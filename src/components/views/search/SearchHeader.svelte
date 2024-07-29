<script lang="ts">
  import { Icon } from "@component-utils";
  import { Button, ChipChooser, SearchField } from "@interactables";
  import { searchQuery, selectedChips } from "@stores/Search";
  import { pop } from "svelte-spa-router";

  import { BackArrow, Close, Tune } from "@icons";
  import { t } from "@stores/Locale";
  import { showAdvancedFilters } from "@stores/Modals";
  import { lastView, selectedView } from "@stores/State";

  export let highlight: boolean;

  const options = [
    { label: $t("SONGS_TITLE"), value: "song" },
    { label: $t("ALBUMS_TITLE"), value: "album" },
    { label: $t("ARTISTS_TITLE"), value: "artist" },
    { label: $t("PLAYLISTS_TITLE"), value: "playlist" },
    { label: $t("GENRES_TITLE"), value: "genre" },
  ];

  function goBack() {
    $searchQuery = "";
    $selectedView = $lastView!;
    $selectedChips = [];
    pop();
  }

  function clearSearch() {
    $searchQuery = "";
  }
</script>

<div class="view-header" class:highlight>
  <div class="row">
    <div class="left">
      <Button type="text" iconType="full" on:click={goBack}>
        <Icon icon={BackArrow} width="20px" height="20px" />
      </Button>
    </div>
    <div class="search-container">
      <SearchField placeholder={$t("SEARCH_TITLE")} bind:value={$searchQuery} />
    </div>
    <div class="right" style:visibility={$searchQuery === "" ? "hidden" : "visible"}>
      <Button type="text" iconType="full" on:click={clearSearch}>
        <Icon icon={Close} width="20px" height="20px" />
      </Button>
    </div>
    <div class="right" style="margin-right: 10px;">
      <Button type="text" iconType="full" on:click={() => $showAdvancedFilters = true}>
        <Icon icon={Tune} width="20px" height="20px" />
      </Button>
    </div>
  </div>
  <div class="chips styled-scrollbar">
    <ChipChooser options={options} bind:chosenOptions={$selectedChips} type="general" />
  </div>
</div>

<style>
  .view-header {
    padding: 5px 0px;
    width: 100%;
    transition: background-color 0.2s ease-in-out;
  }

  .row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .highlight {
    background-color: rgb(var(--m3-scheme-surface-container));
  }

  .search-container {
    height: 40px;
    width: calc(100% - 120px - 20px);
  }

  .left {
    height: 40px;
    margin-left: 10px;
  }

  .right {
    height: 40px;
  }

  .chips {
    margin-top: 10px;
    overflow-x: scroll;
    padding: 0rem 0.5rem;
  }
</style>