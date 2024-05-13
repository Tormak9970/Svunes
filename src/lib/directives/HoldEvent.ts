import type { Action } from "svelte/action"

type HoldEventParams = {
  onHold: () => void,
  duration: number,
  requireMouseUp?: boolean
}

/**
 * A Svelte directive for applying scroll shadow to elements.
 */
export const holdEvent: Action<HTMLElement, HoldEventParams> = (node: HTMLElement, { onHold, duration, requireMouseUp = false }) => {
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
    e.preventDefault();
    e.stopImmediatePropagation();
    startTime = Date.now();

    if (!requireMouseUp) {
      setTimeout(() => {
        if (shouldTrigger) {
          let currentTime = Date.now();
  
          if (currentTime - startTime >= duration) {
            blockClick = true;
            onHold();
          }
  
          startTime = currentTime;
        }
        
        shouldTrigger = !shouldTrigger;
      }, duration);
    }
  }

  function mouseUp(e: MouseEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (requireMouseUp) {
      let currentTime = Date.now();

      if (currentTime - startTime >= duration) {
        blockClick = true;
        onHold();
      }

      startTime = currentTime;
    } else {
      shouldTrigger = false;
    }
  }

  node.addEventListener("mousedown", mouseDown);
  node.addEventListener("mouseup", mouseUp);
  node.addEventListener('click', checkClick, true);

  return {
    update({ onHold, duration }: HoldEventParams) {
      
    },
    destroy() {
      node.removeEventListener("mousedown", mouseDown);
      node.removeEventListener("mouseup", mouseUp);
      node.removeEventListener('click', checkClick);
    }
  }
}