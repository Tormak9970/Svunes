<script lang="ts">
  import type { ActionMenuItem, ContextMenuItem, IconMenuItem } from "@directives";
  import { Divider, MenuItem } from "@layout";
  import { contextMenuItems, contextMenuPosition, showContextMenu } from "@stores/ContextMenu";
  import { onMount } from "svelte";

  let menuElement: any;

  $: menuElement && (menuElement.open = $showContextMenu);

  $: xOffset = $contextMenuPosition.x;
  $: yOffset = $contextMenuPosition.y;

  function handleScroll() {
    console.log("scrolled");
    if ($showContextMenu) $showContextMenu = false;
  }

  function isIconItem(item: ContextMenuItem): item is IconMenuItem {
    return !!(item as IconMenuItem).icon;
  }

  function isActionItem(item: ContextMenuItem): item is ActionMenuItem {
    return !!(item as ActionMenuItem).action;
  }

  function close() {
    $showContextMenu = false;
  }

  onMount(() => {
    const style = document.createElement("style");
    style.innerHTML = '.items { scrollbar-color: rgb(var(--m3-scheme-primary)) transparent; scrollbar-width: thin; }';
    menuElement.shadowRoot?.appendChild(style);

    $showContextMenu = false;
  });
</script>

<svelte:document on:wheel={handleScroll} on:mousedown={handleScroll} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="context-menu-container"
  style:--md-menu-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-selected-container-color="rgb(var(--m3-scheme-secondary-container))"
  style:left="{xOffset}px"
  style:top="{yOffset}px"
>
  <div id="contextMenuAnchor" class="context-anchor-element" />
  <md-menu
    bind:this={menuElement}
    anchor="contextMenuAnchor"
    on:wheel|stopImmediatePropagation
    on:mousedown|stopImmediatePropagation
    on:closing={close}
  >
    {#each $contextMenuItems as item, i (i)}
      {#if isIconItem(item)}
        <MenuItem icon={item.icon} on:click={() => { item.action(); $showContextMenu = false; }}>
          {item.text}
        </MenuItem>
      {:else if isActionItem(item)}
        <MenuItem on:click={() => { item.action(); $showContextMenu = false; }}>
          {item.text}
        </MenuItem>
      {:else}
        <Divider />
      {/if}
    {/each}
  </md-menu>
</div>

<style>
  .context-menu-container,
  .context-anchor-element {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>