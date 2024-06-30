<script lang="ts">
  import { isSwitchingView, lastView, selectedView, viewsToRender } from "@stores/State";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { sharedAxisTransition } from "../../utils/animations/animations";

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
  <div class="header">
    <slot name="header" />
  </div>
  <div class="content">
    <slot name="content" />
  </div>
</div>

<style>
  .view-container {
    position: absolute;
    top: 0;
    background-color: rgb(var(--m3-scheme-background));

    width: 100%;
    height: 100%;
  }
  .content {
    height: calc(100% - 50px);
    overflow: hidden;
  }
</style>