export interface TooltipActionProps {
  /**
   * The action to trigger the tooltip
   * @default 'hover'
   */
  action?: 'hover' | 'click' | 'prop' | string;

  /**
   * The alignment of the tooltip.
   * @default 'left'
   */
  align?: 'left' | 'right' | 'center' | string;

  /**
   * The animation style of the tooltip.
   * @default ''
   */
  animation?: string;

  /**
   * Whether to show the arrow of the tooltip.
   * @default true
   */
  arrow?: boolean;

  /**
   * Whether to automatically position the tooltip when clipping occurs.
   * @default false
   */
  autoPosition?: boolean;

  /**
   * The content of the tooltip.
   * @default ''
   */
  content?: string | { component: any; props?: Record<string, any>; };

  /**
   * The animation's delay of the tooltip.
   * @default 200
   */
  delay?: number;

  /**
   * The maximum width of the tooltip.
   * @default 200
   */
  maxWidth?: number;

  /**
   * The position of the tooltip.
   * @default 'top'
   */
  position?: 'bottom' | 'left' | 'right' | 'top' | string;

  /**
   * Control the visibility of the tooltip.
   * @default false
   */
  show?: boolean;

  /**
   * The style of the tooltip.
   * @default null
   */
  style?: Record<string, string> | null;

  /**
   * The target element to bind the tooltip to.
   * @default null
   */
  targetElement?: HTMLElement | null;

  /**
   * The theme of the tooltip.
   * @default ''
   */
  theme?: string;
}