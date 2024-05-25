<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Dialog from "../../utils/Dialog.svelte";

  export let show: boolean;
  export let headline: string;
  export let icon: IconifyIcon | undefined = undefined;
  export let canClose = true;
</script>

<Dialog headline={headline} icon={icon} open={show} closeOnClick={canClose} closeOnEsc={canClose}>
  <slot name="content" />
  <div slot="buttons">
    <slot name="actions" />
  </div>
</Dialog>