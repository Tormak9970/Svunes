<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Dialog from "../../utils/Dialog.svelte";

  export let show: boolean;
  export let headline: string;
  export let icon: IconifyIcon | undefined = undefined;
</script>

<Dialog headline={headline} icon={icon} open={show}>
  <slot name="content" />
  <div slot="buttons">
    <slot name="actions" />
  </div>
</Dialog>