<script lang="ts">
  import { Icon, MediaQuery } from "@component-utils";
  import { GridView, Settings } from "@icons";
  import { Button, MenuButton } from "@interactables";
  import { MenuItem } from "@layout";
  import { desktopSidePanel, isLandscape, SidePanels } from "@stores/Layout";
  import { t } from "@stores/Locale";
  import { showAlbumSortOrder, showArtistSortOrder, showGridSize, showPlaylistSortOrder, showSongSortOrder } from "@stores/Modals";
  import { showNowPlaying } from "@stores/Overlays";
  import { lastView, selectedView } from "@stores/State";
  import { View } from "@types";
  import { push } from "svelte-spa-router";
  import DesktopNav from "../navigation/DesktopNav.svelte";
  import NowPlayingDesktop from "./NowPlayingDesktop.svelte";
  import SidePanelRouter from "./SidePanelRouter.svelte";

  let condenseNav = false;
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
</script>

<MediaQuery query="(max-width: 1100px)" bind:matches={condenseNav} />
{#if $isLandscape}
  <div class="desktop-container">
    <div class="panels">
      <div class="nav" style:width={condenseNav ? "3.5rem" : "10rem"}>
        <DesktopNav condenseNav={condenseNav} />
        <div class="buttons-container" style:flex-direction={condenseNav ? "column-reverse" : "row"}>
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
      <div class="view-panel">
        <slot />
      </div>
      <div class="side-panel-wrapper" style:width={$desktopSidePanel !== SidePanels.NONE ? "20.5rem" : "0rem"}>
        {#if $desktopSidePanel !== SidePanels.NONE}
          <SidePanelRouter />
        {/if}
      </div>
    </div>
    <div class="now-playing-wrapper" style:height={$showNowPlaying ? "5.5rem" : "0rem"}>
      {#if $showNowPlaying}
        <NowPlayingDesktop />
      {/if}
    </div>
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

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    transition: width 0.2s ease-in-out;
  }

  .buttons-container {
    display: flex;
  }

  .panels {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }

  .view-panel {
    margin-left: 0.5rem;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    flex-grow: 1;

    position: relative;

    background-color: rgb(var(--m3-scheme-surface-container-low));
  }

  .side-panel-wrapper {
    height: 100%;
    transition: width 0.2s ease-in-out;
  }

  .now-playing-wrapper {
    width: 100%;
    transition: height 0.2s ease-in-out;
  }
</style>