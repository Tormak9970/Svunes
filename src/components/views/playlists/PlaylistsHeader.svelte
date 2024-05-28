<script lang="ts">
  import ViewHeader from "../utils/ViewHeader.svelte";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import { selectedChip } from "../../../stores/Search";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Button from "../../interactables/Button.svelte";
  import Icon from "../../utils/Icon.svelte";
  import { showGridSize, showPlaylistSortOrder } from "../../../stores/Modals";
  import { push } from "svelte-spa-router";
  import { selectedView } from "../../../stores/State";
  import { View } from "../../../types/View";
  import MenuItem from "../../layout/MenuItem.svelte";
  import { dialog } from "@tauri-apps/api";
  import { AppController } from "../../../lib/controllers/AppController";
  import { showCreatePlaylist } from "../../../stores/Overlays";

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
    $selectedChip = "all";
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
  <div slot="right">
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>Grid Size</MenuItem>
      <MenuItem on:click={() => { $showPlaylistSortOrder = true; menuIsOpen = false; }}>Sort By</MenuItem>
      <MenuItem on:click={() => { $showCreatePlaylist = true; }}>New Playlist</MenuItem>
      <MenuItem on:click={importPlaylist}>Import</MenuItem>
      <MenuItem on:click={goToSettings}>Settings</MenuItem>
    </MenuButton>
  </div>
</ViewHeader>