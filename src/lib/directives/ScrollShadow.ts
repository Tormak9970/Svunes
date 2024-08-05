import type { Action } from "svelte/action";
import { writable } from "svelte/store";

type ScrollShadowParams = {
  /**
   * The CSS variable to use as the scroll shadow's background.
   */
  background?: string;
}

/**
 * A Svelte directive for applying scroll shadow to elements.
 */
export const scrollShadow: Action<HTMLElement, ScrollShadowParams | undefined> = (node: HTMLElement, props = { background: "--m3-scheme-surface-container-high" }) => {
  const parent = node.parentElement!;

  const useBackground = writable(props.background ?? "--m3-scheme-surface-container-high");
  const useBackgroundUnsub = useBackground.subscribe((background: string) => {
    parent.style.setProperty("--scroll-shadow-color", `var(${background})`);
  });
  
  const isOverflowingTop = writable(false);
  const isOverflowingTopUnsub = isOverflowingTop.subscribe((isOverflowing: boolean) => {
    if (isOverflowing) {
      parent.classList.add("overflow-top");
    } else {
      parent.classList.remove("overflow-top");
    }
  });

  const isOverflowingBottom = writable(Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop) > 1);
  const isOverflowingBottomUnsub = isOverflowingBottom.subscribe((isOverflowing: boolean) => {
    if (isOverflowing) {
      parent.classList.add("overflow-bottom");
    } else {
      parent.classList.remove("overflow-bottom");
    }
  });

  const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    const element = entries[0].target;
    
    isOverflowingTop.set(element.scrollTop !== 0);
    isOverflowingBottom.set(Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) > 1);
  });
  
  node.addEventListener("scroll", scrollHandler);
  parent.classList.add("scroll-shadow");
  observer.observe(node);


  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;

    isOverflowingTop.set(element.scrollTop !== 0);
    isOverflowingBottom.set(Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) > 1);
  }


  return {
    update(props = { background: "--m3-scheme-surface-container-high" }) {
      useBackground.set(props.background ?? "--m3-scheme-surface-container-high");
    },
    destroy() {
      node.removeEventListener("scroll", scrollHandler);
      observer.disconnect();

      useBackgroundUnsub();
      isOverflowingTopUnsub();
      isOverflowingBottomUnsub();

      parent.classList.remove("scroll-shadow");
      parent.classList.remove("overflow-top");
      parent.classList.remove("overflow-bottom");
    }
  }
}