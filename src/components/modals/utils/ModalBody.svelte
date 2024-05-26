<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Dialog from "../../utils/Dialog.svelte";

  export let show: boolean;
  export let headline: string;
  export let icon: IconifyIcon | undefined = undefined;
  export let canClose = true;
  export let onClose: () => void;
</script>

<Dialog headline={headline} icon={icon} open={show} closeOnClick={canClose} closeOnEsc={canClose} on:closedByEsc={onClose} on:closedByClick={onClose} >
  <slot name="content" />
  <div slot="buttons">
    <slot name="actions" />
  </div>
</Dialog>