<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  export let display = "inline-flex";
  export let extraOptions: HTMLAttributes<HTMLDivElement> = {};
</script>

<div class="m3-container" style="display: {display};" {...extraOptions}>
  <slot />
</div>

<style>
  :root {
    --m3-segmented-button-shape: var(--m3-util-rounding-full);
  }

  .m3-container {
    border: 0.0625rem solid rgb(var(--m3-scheme-outline));
    height: 2rem;
    border-radius: var(--m3-segmented-button-shape);
    overflow: hidden;
  }
</style>