<script lang="ts">
  import { easeEmphasizedAccel, easeEmphasizedDecel } from "@utils";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { drag } from "svelte-gesture";
  import { spring, tweened } from "svelte/motion";
  import type { Unsubscriber } from "svelte/store";

  let heightUnsub: Unsubscriber;

  let dialogElement: HTMLDialogElement;

  export let maxHeight = 1000;
  export let closeThreshold = 0.4;
  export let padding = "0 1rem";

  let leaving = false;
  let hasMounted = false;

  const dispatch = createEventDispatcher();

  const actualHeight = tweened(0, {
    duration: 400,
    easing: easeEmphasizedDecel
  });
  const dragHeight = spring(0, {});

  /**
   * Handles opening the sheet.
   */
  const open = (node: HTMLDialogElement) => {
    node.inert = true;
    node.showModal();
    node.inert = false;
  }

  const close = () => {
    leaving = true;
    actualHeight.set(0, {
      duration: 200,
      easing: easeEmphasizedAccel
    });
  }

  function dragHandler({ detail }: any) {
    const { active, movement: [, my], direction: [, dy], offset: [, oy] } = detail;

    $dragHeight = my;
    
    if (($actualHeight - oy) / $actualHeight <= closeThreshold && !active) {
      close();
      return;
    }

    if (!active) $dragHeight = 0;
  }

  onMount(() => {
    $actualHeight = Math.min(maxHeight, dialogElement.scrollHeight);
    heightUnsub = actualHeight.subscribe((height) => {
      if (height === 0 && hasMounted) dispatch("close");
    });
    hasMounted = true;
  });

  onDestroy(() => {
    if (heightUnsub) heightUnsub();
  });
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  class="m3-container"
  class:leaving
  style:max-height="{$actualHeight - $dragHeight}px"
  use:open
  on:cancel|preventDefault={close}
  on:click|self={close}
  bind:this={dialogElement}
  use:drag on:drag={dragHandler}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    style:padding={padding}
    class="sheet-container"
    on:click|stopImmediatePropagation
  >
    <div class="handle-container" >
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
    animation: backdropReverse 200ms;
  }
  .sheet-container {
    touch-action: auto;
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
</style>