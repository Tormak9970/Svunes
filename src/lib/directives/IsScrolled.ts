import type { Action } from "svelte/action";

type IsScrolledParams = {
  callback: (isScrolled: boolean) => void;
}

/**
 * A Svelte directive for detecting when an element has been scrolled.
 */
export const isScrolled: Action<HTMLElement, IsScrolledParams | undefined> = (node: HTMLElement, props = { callback: () => {} }) => {
  const { scrollTop } = node;
  let isScrolled = scrollTop !== 0;
  (props as any).callback(isScrolled);

  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    const { scrollTop } = element;
    const newIsScrolled = scrollTop !== 0;
    
    if (newIsScrolled !== isScrolled) {
      (props as any).callback(newIsScrolled);
      isScrolled = newIsScrolled;
    }
  }

  node.addEventListener("scroll", scrollHandler);

  return {
    update(props = { callback: () => {} }) {
      const { scrollTop } = node;
      const newIsScrolled = scrollTop !== 0;
      if (newIsScrolled !== isScrolled) {
        (props as any).callback(newIsScrolled);
        isScrolled = newIsScrolled;
      }
    },
    destroy() {
      node.removeEventListener("scroll", scrollHandler);
    }
  }
}