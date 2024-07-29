import type { Action } from "svelte/action";

type HoldEventParams = {
  onHold: () => void;
  duration: number;
  holdable?: boolean;
}

/**
 * A Svelte directive for listening to hold events.
 */
export const holdEvent: Action<HTMLElement, HoldEventParams> = (node: HTMLElement, { onHold, holdable, duration }) => {
  let startTime = Date.now();
  let shouldTrigger = true;
  let blockClick = false;

  function checkClick(e: MouseEvent) {
    if (blockClick) {
      e.preventDefault();
      e.stopImmediatePropagation();
      blockClick = false;
    }
  }

  function mouseDown(e: MouseEvent) {
    shouldTrigger = true;
    e.preventDefault();
    e.stopImmediatePropagation();
    startTime = Date.now();

    setTimeout(() => {
      if (shouldTrigger) {
        let currentTime = Date.now();

        if (currentTime - startTime >= duration) {
          blockClick = true;
          onHold();
        }

        startTime = currentTime;
      }
      
      shouldTrigger = true;
    }, duration);
  }

  function mouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();

    shouldTrigger = false;
  }

  if (holdable || holdable === undefined) {
    node.addEventListener("mousedown", mouseDown);
    node.addEventListener("mouseup", mouseUp);
    node.addEventListener('click', checkClick, true);
  }

  return {
    update({ onHold, holdable, duration }: HoldEventParams) {
      
    },
    destroy() {
      node.removeEventListener("mousedown", mouseDown);
      node.removeEventListener("mouseup", mouseUp);
      node.removeEventListener('click', checkClick);
    }
  }
}