import type { Action } from "svelte/action";

type ScrollShadowParams = {
  useBackground?: boolean;
}

/**
 * A Svelte directive for applying scroll shadow to elements.
 */
export const scrollShadow: Action<HTMLElement, ScrollShadowParams | undefined> = (node: HTMLElement, props = { useBackground: false }) => {
  const parent = node.parentElement!;
  
  let isOverflowingTop = false;
  let isOverflowingBottom = Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop) > 1;
  if (isOverflowingBottom) {
    parent.classList.add("overflow-bottom");
  } else {
    parent.classList.remove("overflow-bottom");
  }

  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    const parent = element.parentElement!;

    isOverflowingTop = element.scrollTop !== 0;
    if (isOverflowingTop) {
      parent.classList.add("overflow-top");
    } else {
      parent.classList.remove("overflow-top");
    }

    isOverflowingBottom = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) > 1;
    if (isOverflowingBottom) {
      parent.classList.add("overflow-bottom");
    } else {
      parent.classList.remove("overflow-bottom");
    }
  }

  node.addEventListener("scroll", scrollHandler);
  parent.classList.add("scroll-shadow");

  if ((props as any).useBackground) {
    parent.style.setProperty("--scroll-shadow-color", "var(--m3-scheme-background)");
  } else {
    parent.style.setProperty("--scroll-shadow-color", "var(--m3-scheme-surface-container-high)");
  }


  return {
    update(props = { useBackground: false }) {
      if ((props as any).useBackground) {
        parent.style.setProperty("--scroll-shadow-color", "var(--m3-scheme-background)");
      } else {
        parent.style.setProperty("--scroll-shadow-color", "var(--m3-scheme-surface-container-high)");
      }
    },
    destroy() {
      node.removeEventListener("scroll", scrollHandler);
      parent.classList.remove("scroll-shadow");
      parent.classList.remove("overflow-top");
      parent.classList.remove("overflow-bottom");
    }
  }
}