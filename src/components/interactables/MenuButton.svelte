<script lang="ts">
  import { Icon } from "@component-utils";
  import type { IconifyIcon } from "@iconify/types";
  import { onMount } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import Button from "./Button.svelte";

  export let extraOptions: HTMLAttributes<HTMLButtonElement> = {};
  export let size = "2.5rem";
  export let iconSize = "1.5rem";
  export let width = "36px";
  export let height = "36px";
  export let icon: IconifyIcon;

  let buttonElement: any;
  let menuElement: any;

  export let open = false;
  $: menuElement && (menuElement.open = open);

  function onClick() {
    open = !open;
  }

  onMount(() => {
    menuElement.anchorElement = buttonElement.getButtonElement();

    const style = document.createElement("style");
    style.innerHTML = '.items { scrollbar-color: rgb(var(--m3-scheme-primary)) transparent; scrollbar-width: thin; }';
    menuElement.shadowRoot?.appendChild(style);

    open = false;
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="container"
  on:click|stopImmediatePropagation
  on:mousedown|stopImmediatePropagation
  style:--md-menu-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-selected-container-color="rgb(var(--m3-scheme-secondary-container))"
>
  <Button
    type="text"
    iconType="full"
    size={size}
    iconSize={iconSize}
    on:click={onClick}
    extraOptions={extraOptions}
    bind:this={buttonElement}
  >
    <Icon icon={icon} width="{width}" height="{height}" />
  </Button>
  <md-menu
    bind:this={menuElement}
    anchor-corner={"end-end"}
    menu-corner={"start-end"}
    on:closing={() => open = false}
  >
    <slot />
  </md-menu>
</div>

<style>
  .container {
    position: relative;
  }
</style>