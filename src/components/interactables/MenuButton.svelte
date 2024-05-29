<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Button from "./Button.svelte";
  import Icon from "../utils/Icon.svelte";

  export let width = "36px";
  export let height = "36px";
  export let icon: IconifyIcon;

  let buttonElement: HTMLButtonElement;
  let menuElement: any;

  export let open = false;
  $: menuElement && (menuElement.open = open);

  function onMouseUp(e: Event) {
    if (e.target !== buttonElement) open = false;
  }

  function onClick(e: Event) {
    if (!buttonElement) buttonElement = e.target as HTMLButtonElement;
    if (!menuElement.anchorElement) menuElement.anchorElement = buttonElement;
    open = !open;
  }

</script>

<svelte:window on:mouseup={onMouseUp} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" on:click|stopPropagation style="--md-menu-container-color: rgb(var(--m3-scheme-surface-container)); --md-menu-item-container-color: rgb(var(--m3-scheme-surface-container)); --md-menu-item-selected-container-color: rgb(var(--m3-scheme-secondary-container));">
  <Button type="text" iconType="full" on:click={onClick}>
    <Icon icon={icon} width="{width}" height="{height}" />
  </Button>
  <md-menu bind:this={menuElement} positioning="popover">
    <slot />
  </md-menu>
</div>

<style>
  .container {
    position: relative;
  }
</style>