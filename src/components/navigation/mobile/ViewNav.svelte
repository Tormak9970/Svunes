<script lang="ts">
  import { selectedView, showMiniPlayer, viewsToRender } from "../../../stores/State";
  import QueueMusic from "@ktibow/iconset-material-symbols/queue-music-rounded";
  import Album from "@ktibow/iconset-material-symbols/album";
  import MusicNote from "@ktibow/iconset-material-symbols/music-note";
  import LibraryMusic from "@ktibow/iconset-material-symbols/library-music-rounded";
  import Artist from "@ktibow/iconset-material-symbols/artist-rounded";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import Search from "@ktibow/iconset-material-symbols/search-rounded";
  import Home from "@ktibow/iconset-material-symbols/home-rounded";
  import { selected } from "../../../stores/Select";
  import { View } from "../../../types/View";
  import { NavList, NavListButton } from "m3-svelte";
  
  const icons = {
    0: QueueMusic,
    1: Album,
    2: MusicNote,
    3: LibraryMusic,
    4: Artist,
    5: Settings,
    6: Search,
    7: Home
  }

  /**
   * Sets the selected view to the provided view.
   * @param view The selected view.
   */
  function setSelectedView(view: View) {
    $selectedView = view;
    $selected = [];
  }
</script>

<div class="view-nav" class:rounded={!$showMiniPlayer}>
  <NavList type="bar">
    <div class="items">
      {#each $viewsToRender as view}
        <NavListButton type="auto" on:click={() => setSelectedView(view)} selected={view === $selectedView} icon={icons[view]} />
      {/each}
    </div>
  </NavList>
</div>

<style>
  .view-nav {
    width: 100%;
    height: 60px;

    overflow: hidden;
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

  .items :global(.m3-container) {
    height: auto !important;
  }
</style>