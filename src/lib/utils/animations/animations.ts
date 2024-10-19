import type { cubicOut } from "svelte/easing";
import { easeEmphasized } from "./easing";

interface TransitionOptions {
  delay?: number;
  duration?: number;
  easing?: typeof cubicOut;
}

type SharedAxisXYOptions = {
  direction: "X" | "Y";
  /**
   * true if this element is on the top/left of things
   * if it's first, then use transition: and set it to true
   * if it's last, then use transition: and set it to false
   * if it's in between, use separate in: and out: statements:
   * > set it to false when it's interacting with the left side, and true when interacting with its right
   * > in order to implement this, try something like using a prevPage variable:
   * > ```
   * > {:else if page == 1}
   * > <div
   * >   in:sharedAxisTransition={{
   * >     direction: "X",
   * >     rightSeam: prevPage > 1, (if we're transitioning from a page on the right, rightseam is true)
   * >   }}
   * >   out:sharedAxisTransition={{
   * >     direction: "X",
   * >     rightSeam: page > 1, (if we're transitioning to a page on the right, rightseam is true)
   * >   }}
   * > >
   * > ```
   *
   * i went insane over figuring this out :)
   */
  rightSeam: boolean;
}

type SharedAxisZOptions = {
  direction: "Z";
  leaving: boolean /* set to true in out:, set to false in in: */;
}

type SharedAxisOptions = SharedAxisXYOptions | SharedAxisZOptions;
    
/**
 * ? Its helpful to set a background color on the items, and utilize position relative + absolute to let them overlap.
 */
export function sharedAxisTransition(node: Element, options: TransitionOptions & SharedAxisOptions) {
  return {
    delay: options.delay,
    duration: options.duration || 500,
    easing: options.easing || easeEmphasized,
    css: (t: number, u: number) => {
      const opacity = (t - 0.35) * (1 / 0.35);

      if (options.direction == "Z") {
        const factor = options.leaving ? u * 0.1 + 1 : t * 0.2 + 0.8;
        let css = `transform: scale(${factor.toFixed(3)});`;

        if (!options.leaving) css += `opacity: ${opacity.toFixed(3)};`;

        return css;
      }

      const factor = u * (options.rightSeam ? -30 : 30);

      return (
        `transform: translate${options.direction}(${factor.toFixed(3)}px);` +
        `opacity: ${opacity.toFixed(3)}`
      );
    },
  };
};