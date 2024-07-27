<script lang="ts">
  import { Tooltip } from "@svelte-plugins/tooltips";

  export let action: 'hover' | 'click' = 'hover';

  export let content: string | { component: any; props?: Record<string, any>; } = '';

  export let align: 'left' | 'center' | 'right' = 'left';

  export let position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  export let maxWidth = 200;

  export let animation = '';

  export let hideOnClickOutside = false;

  export let autoPosition = false;
</script>


<Tooltip
  {action}
  {content}
  {align}
  {position}
  {maxWidth}
  theme="tooltip-theme"
  {animation}
  {hideOnClickOutside}
  {autoPosition}
>
  <slot />
</Tooltip>