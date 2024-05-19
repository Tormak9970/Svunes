<script lang="ts">
  import ViewHeader from "../utils/ViewHeader.svelte";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import { selectedChip } from "../../../stores/Search";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import { showArtistSortOrder, showGridSize } from "../../../stores/Modals";
  import { push } from "svelte-spa-router";
  import { selectedView } from "../../../stores/State";
  import { View } from "../../../types/View";

  export let highlight: boolean;

  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $selectedView = View.SEARCH;
    $selectedChip = "artist";
    push("/search");
  }

  let menuIsOpen = false;
</script>

<ViewHeader title="Artists" highlight={highlight}>
  <div slot="left">
    <Button type="text" iconType="full" on:click={openSearch}>
      <Icon icon={Search} width="20px" height="20px" />
    </Button>
  </div>
  <div slot="right">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <Menu>
        <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>Grid Size</MenuItem>
        <MenuItem on:click={() => { $showArtistSortOrder = true; menuIsOpen = false; }}>Sort By</MenuItem>
        <MenuItem on:click={goToSettings}>Settings</MenuItem>
      </Menu>
    </MenuButton>
  </div>
</ViewHeader>