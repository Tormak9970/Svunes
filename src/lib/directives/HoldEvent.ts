import type { Action } from "svelte/action";

type HoldEventParams = {
  onHold: () => void;
  duration: number;
  holdable?: boolean;
}

/**
 * A Svelte directive for listening to hold events.
 */
export const holdEvent: Action<HTMLElement, HoldEventParams> = (node: HTMLElement, { onHold, holdable, duration }: HoldEventParams = { onHold: () => {}, holdable: true, duration: 300 }) => {
  let config: HoldEventParams = { onHold, holdable, duration };
  let timeoutId: number | null = null;
  let blockClick = false;

  function checkClick(e: MouseEvent) {
    if (blockClick) {
      e.preventDefault();
      e.stopImmediatePropagation();
      blockClick = false;
    }
  }

  function mouseDown() {
    timeoutId = setTimeout(() => {
      blockClick = true;
      config.onHold();
      timeoutId = null;
    }, config.duration);
  }

  function mouseUp() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  node.addEventListener("mousedown", mouseDown);
  node.addEventListener("mouseup", mouseUp);
  node.addEventListener('click', checkClick, true);

  return {
    update({ onHold, holdable, duration }: HoldEventParams) {
      config = { onHold, holdable, duration };
    },
    destroy() {
      node.removeEventListener("mousedown", mouseDown);
      node.removeEventListener("mouseup", mouseUp);
      node.removeEventListener('click', checkClick);
      
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  }
}