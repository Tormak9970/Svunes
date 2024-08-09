<script lang="ts">
  import { MenuItem } from "@layout";
  import { contextMenuPosition, showContextMenu } from "@stores/ContextMenu";
  import { onMount } from "svelte";


  let menuElement: any;

  export let anchorElement: HTMLDivElement;
  $: menuElement && (menuElement.open = $showContextMenu);

  $: xOffset = $contextMenuPosition.x;
  $: yOffset = $contextMenuPosition.y;

  function close() {
    $showContextMenu = false;
  }

  onMount(() => {
    menuElement.anchorElement = anchorElement;

    const style = document.createElement("style");
    style.innerHTML = '.items { scrollbar-color: rgb(var(--m3-scheme-primary)) transparent; scrollbar-width: thin; }';
    menuElement.shadowRoot?.appendChild(style);

    $showContextMenu = false;
  });
</script>

<!-- TODO: check menu button listener prevention to see if its needed here -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="container"
  style:--md-menu-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-selected-container-color="rgb(var(--m3-scheme-secondary-container))"
>
  <md-menu
    bind:this={menuElement}
    anchor-corner="end-end"
    menu-corner="start-end"
    positioning="document"
    x-offset={300}
    y-offset={0}
    on:closing={close}
  >
    <MenuItem>
      PLAY_NEXT_ACTION
    </MenuItem>
    <MenuItem>
      ADD_TO_QUEUE_ACTION
    </MenuItem>
    <MenuItem>
      ADD_TO_PLAYLISTS_ACTION
    </MenuItem>
  </md-menu>
</div>