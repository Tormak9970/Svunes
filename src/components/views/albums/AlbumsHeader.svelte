<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MenuItem from "@layout/MenuItem.svelte";
  import { showAlbumSortOrder, showGridSize } from "@stores/Modals";
  import { selectedChips } from "@stores/Search";
  import { lastView, selectedView } from "@stores/State";
  import { push } from "svelte-spa-router";
  import { View } from "../../../types/View";
  import Icon from "../../utils/Icon.svelte";
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
    $selectedChips = [ "album" ];
    push("/search");
  }

  let menuIsOpen = false;
</script>

<ViewHeader title="Albums" highlight={highlight}>
  <div slot="left">
    <Button type="text" iconType="full" on:click={openSearch}>
      <Icon icon={Search} width="20px" height="20px" />
    </Button>
  </div>
  <div slot="right">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>Grid Size</MenuItem>
      <MenuItem on:click={() => { $showAlbumSortOrder = true; menuIsOpen = false; }}>Sort By</MenuItem>
      <MenuItem on:click={goToSettings}>Settings</MenuItem>
    </MenuButton>
  </div>
</ViewHeader>