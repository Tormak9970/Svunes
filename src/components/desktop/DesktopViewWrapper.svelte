<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import GridView from "@ktibow/iconset-material-symbols/grid-view";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import MenuItem from "@layout/MenuItem.svelte";
  import { desktopSidePanel, SidePanels } from "@stores/Desktop";
  import { t } from "@stores/Locale";
  import { showAlbumSortOrder, showArtistSortOrder, showGridSize, showPlaylistSortOrder, showSongSortOrder } from "@stores/Modals";
  import { showNowPlaying } from "@stores/Overlays";
  import { lastView, selectedView } from "@stores/State";
  import { push } from "svelte-spa-router";
  import { fly } from "svelte/transition";
  import { View } from "../../types/View";
  import DesktopNav from "../navigation/DesktopNav.svelte";
  import NowPlayingDesktop from "./NowPlayingDesktop.svelte";

  let menuIsOpen = false;

  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $lastView = $selectedView;
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Handles showing the correct "Sort By" modal.
   */
  function onSortByClick() {
    switch ($selectedView) {
      case View.PLAYLISTS:
        $showPlaylistSortOrder = true;
        break;
      case View.ALBUMS:
        $showAlbumSortOrder = true;
        break;
      case View.SONGS:
        $showSongSortOrder = true;
        break;
      case View.ARTISTS:
        $showArtistSortOrder = true;
        break;
      default:
        break;
    }
    menuIsOpen = false;
  }

  let showingSidePanel = true; // ! this'll need to be a store
</script>

<!-- svelte-ignore missing-declaration -->
{#if !IS_MOBILE}
  <div class="desktop-container">
    <div class="panels">
      <div class="nav">
        <DesktopNav />
        <div class="buttons-container">
          <Button type="text" iconType="full" on:click={goToSettings}>
            <Icon icon={Settings} width="20px" height="20px" />
          </Button>
          {#if $selectedView === View.PLAYLISTS || $selectedView === View.ALBUMS || $selectedView === View.SONGS || $selectedView === View.ARTISTS}
            <MenuButton icon={GridView} bind:open={menuIsOpen}>
              <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>{$t("GRID_SIZE_ACTION")}</MenuItem>
              <MenuItem on:click={onSortByClick}>{$t("SORT_BY_ACTION")}</MenuItem>
            </MenuButton>
          {/if}
        </div>
      </div>
      <div class="view-panel" style:width={showingSidePanel ? "calc(100% - 10rem - 1rem - 20rem)" : "calc(100% - 10rem - 0.5rem)"}>
        <slot />
      </div>
      {#if $desktopSidePanel !== SidePanels.NONE}
        <div class="details-panel" transition:fly={{ duration: 0.2, x: 200 }}>
          
        </div>
      {/if}
    </div>
    <!-- svelte-ignore missing-declaration -->
    {#if $showNowPlaying}
      <NowPlayingDesktop />
    {/if}
  </div>
{:else}
  <slot />
{/if}

<style>
  .desktop-container {
    display: flex;
    flex-direction: column;
    height: calc(100% - 1rem);
    width: calc(100% - 1rem);
    padding: 0.5rem;
  }

  .nav {
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    width: 10rem;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .buttons-container {
    display: flex;
  }

  .panels {
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: 0.5rem;
  }

  .view-panel {
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    flex-grow: 1;

    position: relative;

    background-color: rgb(var(--m3-scheme-surface-container-low));

    /* transition: width 0.2s ease-in-out; */
  }

  .details-panel {
    height: 100%;
    width: 20rem;
    border-radius: 10px;
    overflow: hidden;

    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
</style>