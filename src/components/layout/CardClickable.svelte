<script lang="ts">
  import { contextMenu, holdEvent, type ContextMenuItem } from "@directives";
  import { createEventDispatcher } from "svelte";
  import type { HTMLAttributes, HTMLButtonAttributes } from "svelte/elements";

  const dispatch = createEventDispatcher();

  export let extraOptions: HTMLAttributes<HTMLDivElement> & HTMLButtonAttributes = {};
  export let highlight = false;
  export let holdable = true;
  export let type: "elevated" | "filled" | "outlined" | "transparent";
  export let ctxMenuId = "disabled-menu";
  export let ctxMenuItems: ContextMenuItem[] = [];

  /**
   * Notifies the parent when the user holds on the card.
   */
  function onHold() {
    dispatch("hold");
  }
</script>

<button
  on:click|stopPropagation
  use:holdEvent={{ onHold: onHold, holdable: holdable, duration: 300 }}
  use:contextMenu={{ id: ctxMenuId, items: ctxMenuItems, disabled: ctxMenuId === "disabled-menu" || ctxMenuItems.length === 0 }}
  class="m3-container type-{type}"
  {...extraOptions}
>
  <div class="layer" class:highlight />
  <slot />
</button>

<style>
  :root {
    --m3-card-shape: var(--m3-util-rounding-medium);
  }
  .m3-container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 1rem; /* protip: use margin: -1rem (adjust as needed) to make images stretch to the end */
    border: none;
    border-radius: var(--m3-card-shape);
    background-color: rgb(var(--m3-scheme-surface));
    color: rgb(var(--m3-scheme-on-surface));
    transition: background-color 0.2s, box-shadow 0.2s;
  }
  .layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transition: background-color 0.2s;
    pointer-events: none;
  }
  
  .type-transparent {
    background-color: transparent;
  }

  .type-elevated {
    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
  .type-filled {
    background-color: rgb(var(--m3-scheme-surface-container-highest));
  }
  .type-outlined {
    border: solid 0.0625rem rgb(var(--m3-scheme-outline));
  }

  .type-elevated {
    box-shadow: var(--m3-util-elevation-1);
  }

  button {
    text-align: inherit;
    font: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  @media (hover: hover) {
    button:hover {
      box-shadow: var(--m3-util-elevation-1);
    }
    button.type-elevated:hover {
      box-shadow: var(--m3-util-elevation-2);
    }
    button:hover > .layer {
      background-color: rgb(var(--m3-scheme-on-surface) / 0.08);
    }
  }
  button:is(:focus-visible, :active) > .layer {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }
  
  .highlight.layer,
  button:hover > .highlight.layer {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }

  @media print, (forced-colors: active) {
    .layer {
      display: none;
    }
    .type-filled {
      outline: solid 0.125rem;
    }
  }
  @media (forced-colors: active) {
    .type-elevated {
      outline: solid 0.125rem;
    }
  }
</style>