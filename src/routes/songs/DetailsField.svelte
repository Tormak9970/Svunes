<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import { Icon, ListItem } from "m3-svelte";

  export let headline: string = "";
  export let supporting: string | undefined = undefined;
  export let lines: number | undefined = undefined;
  export let icon: IconifyIcon;
</script>

<ListItem headline={headline} supporting={supporting} lines={lines}>
  <svelte:fragment slot="leading">
    <Icon icon={icon} />
  </svelte:fragment>
</ListItem>