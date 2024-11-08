<script lang="ts">
  import { Icon } from "@component-utils";
  import type { IconifyIcon } from "@iconify/types";
  import { ListItem } from "@layout";

  export let headline: string = "";
  export let supporting: string | undefined = undefined;
  export let lines: number | undefined = undefined;
  export let icon: IconifyIcon;
</script>

<ListItem
  headline={headline}
  supporting={supporting}
  lines={lines}
  extraOptions={{
    style: "min-height: 3.5rem; height: auto;"
  }}
>
  <svelte:fragment slot="leading">
    <Icon icon={icon} />
  </svelte:fragment>
</ListItem>