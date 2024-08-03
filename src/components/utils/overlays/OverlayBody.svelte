<script lang="ts">
  import { fly } from "svelte/transition";
</script>

<div class="full-screen-overlay" transition:fly={{ duration: 200, x: 400 }}>
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

    background-color: rgb(var(--m3-scheme-background));

    z-index: 2;
  }

  .content {
    margin-top: 50px;
    height: calc(100% - 50px);
    padding-left: 10px;
    padding-right: 10px;
  }
</style>