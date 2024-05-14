<script lang="ts">
  import { fly } from "svelte/transition";
</script>

<div class="full-screen-overlay" transition:fly={{ duration: 200, y: 400 }}>
  <div class="headline">
    <slot name="header" />
  </div>
  <div class="content">
    <slot name="content" />
  </div>
</div>

<style>
  .full-screen-overlay {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;

    background-color: var(--md-sys-color-background);

    z-index: 2;
  }
</style>