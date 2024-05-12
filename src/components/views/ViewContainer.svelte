<script>
  import { fade } from "svelte/transition";
  import ScrollableContainer from "../layout/ScrollableContainer.svelte";

  export let scrollTop = 0;
</script>

<div class="view-container" in:fade={{ duration: 200 }}>
  <div class="header">
    <slot name="header" />
  </div>
  <div class="content">
    <ScrollableContainer bind:scrollTop={scrollTop}>
      <slot name="content" />
    </ScrollableContainer>
  </div>
</div>

<style>
  .content {
    height: calc(100vh - 46px - 51px);
    overflow: hidden;
  }
</style>