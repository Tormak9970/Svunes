<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { TransitionConfig } from "svelte/transition";
  import { easeEmphasizedAccel, easeEmphasizedDecel } from "../utils/animations/easing";
  import { outroClass } from "../utils/animations/animations";
  
  /**
   * The bottom sheet height animation.
   */
  function heightAnim(node: HTMLDialogElement, options: Record<string, unknown> = {}): TransitionConfig {
    if (node.clientHeight < height) height = node.clientHeight;

    return {
      duration: 400,
      easing: easeEmphasizedDecel,
      ...options,
      css: (t) => `max-height: ${t * height}px`,
    }
  }

  let dialogElement: HTMLDialogElement;

  let fullHeight: number;
  export let height = 1000;
  export let closeThreshold = 2;
  export let padding = "0 1rem";
  
  let isDragging = false;
  let startY = 0;

  let isMovingBack = false;

  const dispatch = createEventDispatcher();

  /**
   * Handles opening the sheet.
   */
  const open = (node: HTMLDialogElement) => {
    node.inert = true;
    node.showModal();
    node.inert = false;
  }

  /**
   * Function to run on mouse move.
   */
  function moveMouse(e: { clientY: number }) {
    if (isDragging) {
      const distance = e.clientY - startY;
      height -= distance;
      if (height > fullHeight) height = fullHeight;
      startY = e.clientY;
    }
  }

  /**
   * Handles drag start.
   */
  function onDragStart(y: number) {
    isDragging = true;
    startY = y;
  }

  /**
   * Handles drag end.
   */
  function onDragEnd() {
    isDragging = false;

    if (height < fullHeight / closeThreshold) {
      dispatch("close", "low");
    } else {
      isMovingBack = true;
      height = fullHeight;

      setTimeout(() => {
        isMovingBack = false;
      }, 300);
    }
  }

  onMount(() => {
    fullHeight = dialogElement.scrollHeight;
    height = fullHeight;
  });
</script>

<svelte:window
  on:mousemove={moveMouse}
  on:mouseup={onDragEnd}
  on:touchmove={(e) => moveMouse(e.touches[0])}
  on:touchend={onDragEnd}
/>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  class="m3-container"
  class:moving-back={isMovingBack}
  style="max-height: {height}px"
  use:open
  use:outroClass
  on:cancel|preventDefault={() => dispatch("close", "browser")}
  on:mousedown|self={() => dispatch("close", "click")}
  in:heightAnim
  out:heightAnim={{ easing: easeEmphasizedAccel, duration: 300 }}
  bind:this={dialogElement}
>
  <div
    style="padding: {padding}"
    on:touchstart={(e) => onDragStart(e.touches[0].clientY)}
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="handle-container"
      on:mousedown|preventDefault={(e) => onDragStart(e.clientY)}
    >
      <div class="handle" />
    </div>
    <slot />
  </div>
</dialog>

<style>
  :root {
    --m3-bottom-sheet-shape: var(--m3-util-rounding-large);
  }

  .m3-container {
    margin-bottom: 0;
    width: 100%;
    max-width: 40rem;
    overflow: hidden;
    touch-action: none;

    background-color: rgb(var(--m3-scheme-surface-container-low));
    color: rgb(var(--m3-scheme-on-surface));
    border-radius: var(--m3-bottom-sheet-shape) var(--m3-bottom-sheet-shape) 0 0;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background-color: rgb(var(--m3-scheme-scrim) / 0.5);
    animation: backdrop 400ms;
  }
  dialog:global(.leaving)::backdrop {
    background-color: transparent;
    animation: backdropReverse 400ms;
  }
  .handle-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 2rem;
    cursor: grab;
  }
  .handle {
    background-color: rgb(var(--m3-scheme-on-surface-variant) / 0.4);
    width: 2rem;
    height: 0.25rem;
    border-radius: 0.25rem;
  }

  .moving-back {
    transition: max-height 0.3s cubic-bezier(0.356, 0.701, 0, 1.004);
  }

  @keyframes backdrop {
    0% {
      background-color: transparent;
    }
    100% {
      background-color: rgb(var(--m3-scheme-scrim) / 0.5);
    }
  }
  @keyframes backdropReverse {
    0% {
      background-color: rgb(var(--m3-scheme-scrim) / 0.5);
    }
    100% {
      background-color: transparent;
    }
  }
  @media (forced-colors: active) {
    .handle {
      background-color: canvastext;
    }
  }
</style>