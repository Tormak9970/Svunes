<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import { Button, Icon } from "m3-svelte";
  import { containerTransform } from "../animations/animations";

  export let width = "36px";
  export let height = "36px";
  export let icon: IconifyIcon;
  export let duration = 300;

  let buttonElement: HTMLButtonElement;

  const [send, receive] = containerTransform({ duration: duration });

  export let open = false;

  function onMouseUp(e: Event) {
    if (e.target !== buttonElement) open = false;
  }

  function onClick(e: Event) {
    if (!buttonElement) buttonElement = e.target as HTMLButtonElement;
    open = !open;
  }
</script>

<svelte:window on:mouseup={onMouseUp} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" on:click|stopPropagation>
  <Button type="text" iconType="full" on:click={onClick}>
    <Icon icon={icon} width="{width}" height="{height}" />
  </Button>
  {#if open}
    <div class="menu-wrapper" in:receive={{ key: "menu-button" }} out:send={{ key: "menu-button" }}>
      <slot />
    </div>
  {:else}
    <div class="wrapper-placeholder" in:receive={{ key: "menu-button" }} out:send={{ key: "menu-button" }} />
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