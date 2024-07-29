<script lang="ts">
  import { showMiniPlayer } from "@stores/Overlays";
  import { selected } from "@stores/Select";
  import { isLoading, isSwitchingView, lastView, selectedView, viewIndices, viewsToRender } from "@stores/State";
  import { getViewIcon, getViewRoute, View } from "@types";
  import { push } from "svelte-spa-router";
  import { fly } from "svelte/transition";
  import NavList from "./NavList.svelte";
  import NavListButton from "./NavListButton.svelte";

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
      push(getViewRoute(view));
    }
  }
</script>

<div class="view-nav" class:rounded={!$showMiniPlayer} transition:fly={{ duration: 200, y: 60 }}>
  <NavList type="bar" extraOptions={{ style: "padding: 0.75rem 0.5rem; height: 56px;" }}>
    {#each $viewsToRender.sort((a, b) => $viewIndices[a] - $viewIndices[b]) as view}
      <NavListButton
        type="bar"
        icon={getViewIcon(view)}
        selected={view === $selectedView}
        on:click={() => setSelectedView(view)}
      />
    {/each}
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
</style>