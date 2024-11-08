import { SvelteComponent } from "svelte";
import Tooltip from './ActionTooltip.svelte';
import type { TooltipActionProps } from "./types";

interface ActionProps extends TooltipActionProps {
  tooltipId: number;

  /**
   * Whether to hide the tooltip when clicking outside.
   * Only works when action is set to 'click'.
   * @default false
   */
  hideOnClickOutside?: boolean;
}

interface TooltipActions {
  destroy(): void;
}

type TooltipDirective = (element: HTMLElement, props: ActionProps) => TooltipActions;

export const tooltip: TooltipDirective = (element, props) => {
  let component: SvelteComponent | null = null;
  let action = props?.action || 'hover';
  const hideOnClickOutside = props?.hideOnClickOutside || false;

  const triggerClassName = `tooltip-trigger-${props.tooltipId}`;

  const detect = (e: Event) => {
    const target = e.target as HTMLElement;
    if (hideOnClickOutside && target && !target.closest('.tooltip') && !target.closest(`.${triggerClassName}`)) {
      onHide();
    }
  };

  const config: any = {
    ...props,
    targetElement: element
  };

  delete config.tooltipId;

  if (config.hideOnClickOutside) {
    delete config.hideOnClickOutside;
  }
  
  if (config.action) {
    delete config.action;
  }

  const onClick = () => {
    if (component) {
      if (action !== 'click' || hideOnClickOutside) {
        onHide();
      }
    } else {
      onShow();
    }
  };

  const onShow = () => {
    if (!component) {
      component = new Tooltip({
        target: element,
        props: config
      });
    }
  };

  const onHide = () => {
    if (component) {
      component.$destroy();
      component = null;
    }
  };

  const addListeners = () => {
    if (element !== null) {
      removeListeners();

      element.classList.add(triggerClassName);

      if (action === 'click') {
        element.addEventListener('click', onClick);

        if (hideOnClickOutside) {
          document.addEventListener('click', detect, {
            passive: true,
            capture: true
          });
        }
      }

      if (action === 'hover') {
        element.addEventListener('mouseenter', onShow);
        element.addEventListener('mouseleave', onHide);
      }
    }
  };

  const removeListeners = () => {
    element.classList.remove(triggerClassName);

    if (hideOnClickOutside) {
      document.removeEventListener('click', detect);
    }

    if (element !== null) {
      element.removeEventListener('click', onClick);
      element.removeEventListener('mouseenter', onShow);
      element.removeEventListener('mouseleave', onHide);
    }
  };

  addListeners();

  if (config.show) {
    setTimeout(onShow, 0);
  }

  return {
    destroy() {
      removeListeners();
    }
  };
};