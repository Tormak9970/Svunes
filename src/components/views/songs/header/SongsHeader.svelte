<script lang="ts">
  import ViewHeader from "../../../layout/ViewHeader.svelte";
  import MenuButton from "../../../interactables/MenuButton.svelte";
  import { selectedView } from "../../../../stores/State";
  import { View } from "../../../../types/View";
  import { selectedChip } from "../../../../stores/Search";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import { fromView } from "../../../../stores/Settings";
  import { showSongGridSize, showSongSortOrder } from "../../../../stores/Overlays";

  export let highlight: boolean;


  function goToSettings() {
    $fromView = View.SONGS;
    $selectedView = View.SETTINGS;
  }

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
        <MenuItem on:click={() => { $showSongGridSize = true; menuIsOpen = false; }}>Grid Size</MenuItem>
        <MenuItem on:click={() => { $showSongSortOrder = true; menuIsOpen = false; }}>Sort Order</MenuItem>
        <MenuItem on:click={goToSettings}>Settings</MenuItem>
      </Menu>
    </MenuButton>
  </div>
</ViewHeader>