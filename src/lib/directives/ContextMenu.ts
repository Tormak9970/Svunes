import type { IconifyIcon } from "@iconify/types";
import { contextMenuItems, contextMenuPosition, showContextMenu } from "@stores/ContextMenu";
import type { Action } from "svelte/action";

export type ActionMenuItem = {
  id: string;
  text: string;
  action: () => void;
}

export type IconMenuItem = {
  id: string;
  icon: IconifyIcon;
  text: string;
  action: () => void;
}

export type SeperatorMenuItem = {
  isSeparator: boolean;
}

export type ContextMenuItem = ActionMenuItem | IconMenuItem | SeperatorMenuItem;

type ContextMenuParams = {
  id: string;
  items: ContextMenuItem[];
  disabled?: boolean;
}

/**
 * A Svelte directive for custom context menus.
 */
export const contextMenu: Action<HTMLElement, ContextMenuParams> = (node: HTMLElement, { id, items, disabled }) => {
  const config = {
    id: id,
    items: items,
    disabled: disabled ?? false,
  }
  
  async function handleContextMenu(e: MouseEvent) {
    if (IS_MOBILE || config.disabled) return;
    e.preventDefault();

    contextMenuItems.set(config.items);

    contextMenuPosition.set({
      x: e.clientX,
      y: e.clientY,
    });

    showContextMenu.set(true);
  }

  node.addEventListener("contextmenu", handleContextMenu);

  return {
    update({ id, items, disabled }) {
      config.id = id;
      config.items = items;
      config.disabled = disabled ?? false;
    },
    destroy() {
      node.removeEventListener("contextmenu", handleContextMenu);
    }
  }
}