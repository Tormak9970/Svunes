<script lang="ts">
  import { selected } from "@stores/Select";
  import { isLoading, isSwitchingView, lastView, selectedView, viewIndices, viewsToRender } from "@stores/State";
  import { push } from "svelte-spa-router";
  import { getViewIcon, getViewName, getViewRoute, View } from "../../types/View";
  import NavList from "./NavList.svelte";
  import NavListButton from "./NavListButton.svelte";

  export let condenseNav = false;

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

<NavList type="rail">
  {#each $viewsToRender.sort((a, b) => $viewIndices[a] - $viewIndices[b]) as view}
    <NavListButton
      type="rail"
      icon={getViewIcon(view)}
      selected={view === $selectedView}
      on:click={() => setSelectedView(view)}
    >
      {#if !condenseNav}
        {getViewName(view)}
      {/if}
    </NavListButton>
  {/each}
</NavList>