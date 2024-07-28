<script lang="ts">
  import { isSwitchingView, lastView, selectedView, viewsToRender } from "@stores/State";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { View } from "../../types/View";
  import { sharedAxisTransition } from "./animations/animations";

  let showHeader = IS_MOBILE || $selectedView === View.HOME || $selectedView === View.SEARCH;

  function determineViewTransitionIn(node: Element) {
    if (!$lastView) {
      return fade(node, { duration: 200 });
    }

    const lastViewIndex = $viewsToRender.indexOf($lastView);
    const currentViewIndex = $viewsToRender.indexOf($selectedView);

    if ($isSwitchingView) {
      return sharedAxisTransition(node, {
        direction: "X",
        duration: 400,
        rightSeam: currentViewIndex < lastViewIndex
      });
    }

    return sharedAxisTransition(node, {
      direction: "Z",
      duration: 400,
      leaving: false
    });
  }

  function determineViewTransitionOut(node: Element) {
    const lastViewIndex = $viewsToRender.indexOf($lastView!);
    const currentViewIndex = $viewsToRender.indexOf($selectedView);

    if ($isSwitchingView) {
      return sharedAxisTransition(node, {
        direction: "X",
        duration: 400,
        rightSeam: currentViewIndex > lastViewIndex
      });
    }

    return fade(node, { duration: 200 });
  }

  onMount(() => {
    $isSwitchingView = false;
  });
</script>

<div class="view-container" in:determineViewTransitionIn out:determineViewTransitionOut>
  <!-- svelte-ignore missing-declaration -->
  <div class="header" style:display={showHeader ? "block" : "none"}>
    <slot name="header" />
  </div>
  <div class="content" style:height={showHeader ? "calc(100% - 50px)" : "100%"}>
    <slot name="content" />
  </div>
</div>

<style>
  .view-container {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;
  }
  .content {
    overflow: hidden;
  }
</style>