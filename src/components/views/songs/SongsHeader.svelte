<script lang="ts">
  import ViewHeader from "../utils/ViewHeader.svelte";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import { selectedView } from "../../../stores/State";
  import { View } from "../../../types/View";
  import { selectedChip } from "../../../stores/Search";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import { fromView } from "../../../stores/Settings";
  import { showGridSize, showSongSortOrder } from "../../../stores/Modals";

  export let highlight: boolean;

  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $fromView = View.SONGS;
    $selectedView = View.SETTINGS;
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $selectedChip = "song";
    $selectedView = View.SEARCH;
  }

  let menuIsOpen = false;
</script>

<ViewHeader title="Songs" highlight={highlight}>
  <div slot="left">
    <Button type="text" iconType="full" on:click={openSearch}>
      <Icon icon={Search} width="20px" height="20px" />
    </Button>
  </div>
  <div slot="right">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <Menu>
        <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>Grid Size</MenuItem>
        <MenuItem on:click={() => { $showSongSortOrder = true; menuIsOpen = false; }}>Sort By</MenuItem>
        <MenuItem on:click={goToSettings}>Settings</MenuItem>
      </Menu>
    </MenuButton>
  </div>
</ViewHeader>