<script>
  import { fade } from "svelte/transition";
</script>

<div class="view-container" in:fade={{ duration: 200 }}>
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