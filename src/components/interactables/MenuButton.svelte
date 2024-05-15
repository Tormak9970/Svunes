<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import { Button, Icon } from "m3-svelte";
  import { containerTransform } from "../animations/animations";

  export let width = "36px";
  export let height = "36px";
  export let icon: IconifyIcon;
  export let duration = 300;

  const [send, receive] = containerTransform({ duration: duration });

  export let open = false;
</script>

<svelte:window on:mouseup={() => open = false} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" on:click|stopPropagation>
  <Button type="text" iconType="full" on:click={() => open = !open}>
    <Icon icon={icon} width="{width}" height="{height}" />
  </Button>
  {#if open}
    <div class="menu-wrapper" in:receive={{ key: "container" }} out:send={{ key: "container" }}>
      <slot />
    </div>
  {:else}
    <div class="wrapper-placeholder" in:receive={{ key: "container" }} out:send={{ key: "container" }} />
  {/if}
</div>

<style>
  .container {
    position: relative;
  }

  .menu-wrapper {
    position: absolute;
    right: 0;
  }

  .wrapper-placeholder {
    position: absolute;
    right: 0;
  }
</style>