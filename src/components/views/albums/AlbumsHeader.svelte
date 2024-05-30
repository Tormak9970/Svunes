<script lang="ts">
  import ViewHeader from "../utils/ViewHeader.svelte";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import { selectedChip } from "../../../stores/Search";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Button from "../../interactables/Button.svelte";
  import Icon from "../../utils/Icon.svelte";
  import { showAlbumSortOrder, showGridSize } from "../../../stores/Modals";
  import { push } from "svelte-spa-router";
  import { lastView, selectedView } from "../../../stores/State";
  import { View } from "../../../types/View";
  import MenuItem from "../../layout/MenuItem.svelte";

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
    $selectedChip = "album";
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