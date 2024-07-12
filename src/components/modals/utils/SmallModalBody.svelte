<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import type { HTMLDialogAttributes } from "svelte/elements";
  import ModalBody from "./ModalBody.svelte";

  export let extraOptions: HTMLDialogAttributes = {};
  export let icon: IconifyIcon | undefined = undefined;
  export let headline: string;
  export let open: boolean;
  export let canClose = true;
</script>

<div class="small-modal">
  <ModalBody bind:open={open} headline={headline} icon={icon} extraOptions={extraOptions} canClose={canClose} on:close on:closeEnd>
    <slot />
  </ModalBody>
</div>

<style>
  .small-modal :global(dialog) {
    min-width: 12.5rem;
  }
  .small-modal :global(.m3-container) {
    padding: 0.5rem 1rem;
  }

  .small-modal :global(.headline) {
    margin-bottom: 0.5rem;

    font-size: 16px;
  }
  .small-modal :global(.content) {
    margin-bottom: 0.5rem;
  }
</style>