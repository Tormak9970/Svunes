<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import Add from "@ktibow/iconset-material-symbols/add-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import { showGridSize, showPlaylistSortOrder } from "@stores/Modals";
  import { showCreatePlaylist } from "@stores/Overlays";
  import { selectedChips } from "@stores/Search";
  import { lastView, selectedView } from "@stores/State";
  import { dialog } from "@tauri-apps/api";
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
    $selectedChips = [ "playlist" ];
    push("/search");
  }

  /**
   * Prompts the user to import a playlist.
   */
  async function importPlaylist() {
    const path = await dialog.open({
      title: "Choose a Playlist",
      directory: false,
      multiple: false,
      filters: [
        {
          "name": "playlist",
          "extensions": [ "json" ]
        }
      ]
    });

    if (path && path !== "") {
      AppController.importPlaylist(path as string);
    }
  }

  let menuIsOpen = false;
</script>

<ViewHeader title="Playlists" highlight={highlight}>
  <div slot="left">
    <Button type="text" iconType="full" on:click={openSearch}>
      <Icon icon={Search} width="20px" height="20px" />
    </Button>
  </div>
  <div slot="right" style="display: flex; align-items: center;">
    <Button type="text" iconType="full" on:click={() => { $showCreatePlaylist = true; }}>
      <Icon icon={Add} width="20px" height="20px" />
    </Button>
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>Grid Size</MenuItem>
      <MenuItem on:click={() => { $showPlaylistSortOrder = true; menuIsOpen = false; }}>Sort By</MenuItem>
      <MenuItem on:click={importPlaylist}>Import</MenuItem>
      <MenuItem on:click={goToSettings}>Settings</MenuItem>
    </MenuButton>
  </div>
</ViewHeader>