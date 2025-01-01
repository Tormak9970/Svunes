<script lang="ts">
  import { Icon } from "@component-utils";
  import type { ContextMenuItem } from "@directives";
  import type { IconifyIcon } from "@iconify/types";
  import { contextMenuItems, contextMenuPosition, showContextMenu } from "@stores/ContextMenu";
  import type { HTMLAttributes } from "svelte/elements";
  import Button from "./Button.svelte";

  export let extraOptions: HTMLAttributes<HTMLButtonElement> = {};
  export let size = "2.5rem";
  export let iconSize = "1.5rem";
  export let width = "36px";
  export let height = "36px";
  export let icon: IconifyIcon;
  export let items: ContextMenuItem[];

  let buttonElement: any;

  const menuWidth = 122;

  function onClick() {
    $contextMenuItems = items;

    const buttonBB = buttonElement.getButtonElement().getBoundingClientRect() as DOMRect;

    $contextMenuPosition = {
      x: buttonBB.x + buttonBB.width - menuWidth,
      y: buttonBB.y + buttonBB.height,
    };

    $showContextMenu = true;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click|stopImmediatePropagation on:mousedown|stopImmediatePropagation>
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
</div>