<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import Add from "@ktibow/iconset-material-symbols/add-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Search from "@ktibow/iconset-material-symbols/search";
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import { t } from "@stores/Locale";
  import { showGridSize, showPlaylistSortOrder } from "@stores/Modals";
  import { showCreatePlaylist } from "@stores/Overlays";
  import { selectedChips } from "@stores/Search";
  import { lastView, selectedView } from "@stores/State";
  import * as dialog from "@tauri-apps/plugin-dialog";
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
    $selectedChips = [ "playlist" ];
    push("/search");
  }

  /**
   * Prompts the user to import a playlist.
   */
  async function importPlaylist() {
    const file = await dialog.open({
      title: $t("CHOOSE_PLAYLIST_MESSAGE"),
      directory: false,
      multiple: false,
      filters: [
        {
          "name": $t("PLAYLIST_SINGULAR_VALUE"),
          "extensions": [ "json" ]
        }
      ]
    });

    if (file && file.path !== "") {
      AppController.importPlaylist(file.path);
    }
  }

  let menuIsOpen = false;
</script>

<ViewHeader title={$t("PLAYLISTS_TITLE")} highlight={highlight}>
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
      <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>{$t("GRID_SIZE_ACTION")}</MenuItem>
      <MenuItem on:click={() => { $showPlaylistSortOrder = true; menuIsOpen = false; }}>{$t("SORT_BY_ACTION")}</MenuItem>
      <MenuItem on:click={importPlaylist}>{$t("IMPORT_ACTION")}</MenuItem>
      <MenuItem on:click={goToSettings}>{$t("SETTINGS_ACTION")}</MenuItem>
    </MenuButton>
  </div>
</ViewHeader>