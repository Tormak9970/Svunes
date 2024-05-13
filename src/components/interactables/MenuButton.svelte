<script lang="ts">
  import type { MdIconButton, MdMenu } from "@material/web/all";
  import { onMount } from "svelte";

  export let width = "36px";
  export let height = "36px";
  export let iconSize = "22px";
  export let hasOverflow = false;

  let buttonElement: MdIconButton;
  let menuElement: MdMenu;

  function onClick(e: MouseEvent) {
    e.stopImmediatePropagation();
    menuElement.open = !menuElement.open;
  }

  onMount(() => {
    menuElement.anchorElement = buttonElement;
  });
</script>

<!-- ? Docs: https://material-web.dev/components/icon-button/#filled-icon-button-tokens -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container">
  <md-icon-button bind:this={buttonElement} style="--_state-layer-width: {width}; --_state-layer-height: {height}; --md--icon-button-icon-size: {iconSize};" on:mousedown|stopPropagation on:click|stopPropagation={onClick}>
    <div style="width: {iconSize}; height: {iconSize};">
      <slot name="icon" />
    </div>
  </md-icon-button>
  <md-menu bind:this={menuElement} positioning="popover" has-overflow={hasOverflow}>
    <slot />
  </md-menu>
</div>

<style>
  .container {
    position: relative;
  }
</style>