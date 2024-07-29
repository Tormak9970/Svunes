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

<div class="list-modal">
  <ModalBody bind:open={open} headline={headline} icon={icon} extraOptions={extraOptions} canClose={canClose} on:close on:closeEnd>
    <slot />
    <slot slot="buttons" name="buttons" />
  </ModalBody>
</div>

<style>
  .list-modal :global(.m3-container) {
    padding: 1.5rem 0px;
  }
  .list-modal :global(.headline) {
    padding: 0px 1rem;
  }
  .list-modal :global(.content) {
    margin-bottom: 0.5rem;
  }
  .list-modal :global(.buttons) {
    padding: 0px 1.5rem;
  }
</style>