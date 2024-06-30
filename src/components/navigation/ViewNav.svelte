<script lang="ts">
  import Album from "@ktibow/iconset-material-symbols/album";
  import Artist from "@ktibow/iconset-material-symbols/artist-rounded";
  import Home from "@ktibow/iconset-material-symbols/home-rounded";
  import LibraryMusic from "@ktibow/iconset-material-symbols/library-music-rounded";
  import MusicNote from "@ktibow/iconset-material-symbols/music-note";
  import QueueMusic from "@ktibow/iconset-material-symbols/queue-music-rounded";
  import Search from "@ktibow/iconset-material-symbols/search-rounded";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import { showMiniPlayer } from "@stores/Overlays";
  import { selected } from "@stores/Select";
  import { isLoading, isSwitchingView, lastView, selectedView, viewIndices, viewsToRender } from "@stores/State";
  import { push } from "svelte-spa-router";
  import { fly } from "svelte/transition";
  import { viewRoutesLUT } from "../../routes";
  import { View } from "../../types/View";
  import NavList from "./NavList.svelte";
  import NavListButton from "./NavListButton.svelte";
  
  const icons = {
    0: QueueMusic,
    1: Album,
    2: MusicNote,
    3: Artist,
    4: LibraryMusic,
    5: Settings,
    6: Home,
    7: Search
  }

  /**
   * Sets the selected view to the provided view.
   * @param view The selected view.
   */
  function setSelectedView(view: View) {
    $lastView = $selectedView;
    $selectedView = view;
    $selected = [];
    $isSwitchingView = view !== View.SETTINGS && view !== View.SEARCH;
    
    if (!$isLoading) {
      push(viewRoutesLUT[view]);
    }
  }
</script>

<div class="view-nav" class:rounded={!$showMiniPlayer} transition:fly={{ duration: 200, y: 60 }}>
  <NavList type="bar" extraOptions={{ style: "padding: 0.75rem 0.5rem; height: 56px;" }}>
    <div class="items">
      {#each $viewsToRender.sort((a, b) => $viewIndices[a] - $viewIndices[b]) as view}
        <NavListButton type="auto" on:click={() => setSelectedView(view)} selected={view === $selectedView} icon={icons[view]} />
      {/each}
    </div>
  </NavList>
</div>

<style>
  .view-nav {
    width: 100%;
    height: 56px;

    overflow: hidden;

    position: relative;
    z-index: 4;
  }

  .rounded {
    border-radius: 10px 10px 0px 0px;
  }

  .items {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>