<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { isSwitchingView, lastView, selectedView, viewsToRender } from "../../../stores/State";
  import { sharedAxisTransition } from "../../animations/animations";

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

  onMount(() => {
    $isSwitchingView = false;
  });
</script>

<div class="view-container" in:determineViewTransitionIn>
  <div class="header">
    <slot name="header" />
  </div>
  <div class="content">
    <slot name="content" />
  </div>
</div>

<style>
  .content {
    height: calc(100vh - 50px - 60px);
    overflow: hidden;
  }
</style>