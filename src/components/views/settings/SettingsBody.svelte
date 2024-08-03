<script lang="ts">
  import { sharedAxisTransition } from "@utils";
</script>

<div class="full-screen-overlay" transition:sharedAxisTransition={{ direction: "Z", leaving: false }}>
  <div style="display: flex;">
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
</style>