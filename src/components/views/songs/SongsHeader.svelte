<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MenuItem from "@layout/MenuItem.svelte";
  import t from "@lib/utils/i18n";
  import { showGridSize, showSongSortOrder } from "@stores/Modals";
  import { selectedChips } from "@stores/Search";
  import { lastView, selectedView } from "@stores/State";
  import { push } from "svelte-spa-router";
  import { View } from "../../../types/View";
  import ViewHeader from "../utils/ViewHeader.svelte";

  export let highlight: boolean;

  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $lastView = $selectedView;
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $lastView = $selectedView;
    $selectedView = View.SEARCH;
    $selectedChips = [ "song" ];
    push("/search");
  }

  let menuIsOpen = false;
</script>

<ViewHeader title={t("SONGS_TITLE")} highlight={highlight}>
  <div slot="left">
    <Button type="text" iconType="full" on:click={openSearch}>
      <Icon icon={Search} width="20px" height="20px" />
    </Button>
  </div>
  <div slot="right">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>{t("GRID_SIZE_ACTION")}</MenuItem>
      <MenuItem on:click={() => { $showSongSortOrder = true; menuIsOpen = false; }}>{t("SORT_BY_ACTION")}</MenuItem>
      <MenuItem on:click={goToSettings}>{t("SETTINGS_ACTION")}</MenuItem>
    </MenuButton>
  </div>
</ViewHeader>