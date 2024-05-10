<script lang="ts">
  import { selectedView, showMiniPlayer, viewsToRender } from "../../../stores/State";
  import type { View } from "../../../types/View";
  import ViewButton from "./ViewButton.svelte";

  function setSelectedView(view: View) {
    $selectedView = view;
  }
</script>

<div class="view-nav" class:rounded={!$showMiniPlayer}>
  {#each $viewsToRender as viewsToRender}
    <ViewButton view={viewsToRender} onSelect={setSelectedView} />
  {/each}
</div>

<style>
  .view-nav {
    width: calc(100% - 20px);

    padding: 10px 10px;

    background-color: var(--md-sys-color-surface-container);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rounded {
    border-radius: 10px 10px 0px 0px;
  }
</style>