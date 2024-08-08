import { PhysicalPosition } from "@tauri-apps/api/dpi";
import { IconMenuItem, Menu, MenuItem, PredefinedMenuItem, type IconMenuItemOptions, type MenuItemOptions, type PredefinedMenuItemOptions } from '@tauri-apps/api/menu';
import type { Action } from "svelte/action";
import { LogController } from "../controllers";

export type ContextMenuItem = MenuItemOptions | IconMenuItemOptions | PredefinedMenuItemOptions;

type ContextMenuParams = {
  id: string;
  items: ContextMenuItem[];
  disabled?: boolean;
}

/**
 * Gets the menu item for the provided menu options.
 * @param item The menu item options.
 */
async function getMenuItem(item: ContextMenuItem) {
  if ((item as IconMenuItemOptions).icon) {
    return await IconMenuItem.new(item as IconMenuItemOptions);
  }

  if ((item as PredefinedMenuItemOptions).item) {
    return await PredefinedMenuItem.new(item as PredefinedMenuItemOptions);
  }

  return await MenuItem.new(item as MenuItemOptions);
}

/**
 * A Svelte directive for custom context menus.
 */
export const contextMenu: Action<HTMLElement, ContextMenuParams> = (node: HTMLElement, { id, items, disabled }) => {
  const config = {
    disabled: disabled ?? false,
  }
  
  let menu: Menu;

  async function updateMenu(id: string, items: ContextMenuItem[]) {
    const menuItems = await Promise.all(items.map((item) => getMenuItem(item)));
  
    menu = await Menu.new({
      id: id,
      items: menuItems,
    });
  }
  
  async function handleContextMenu(e: MouseEvent) {
    if (IS_MOBILE || config.disabled) return;
    e.preventDefault();

    const position = new PhysicalPosition(e.clientX, e.clientY);

    await menu.popup(position).catch((e) => {
      LogController.error(`Failed to open context menu: ${e.message}`);
    });
  }

  node.addEventListener("contextmenu", handleContextMenu);

  updateMenu(id, items);

  return {
    update({ id, items, disabled }) {
      config.disabled = disabled ?? false;
      updateMenu(id, items);
    },
    destroy() {
      node.removeEventListener("contextmenu", handleContextMenu);
    }
  }
}