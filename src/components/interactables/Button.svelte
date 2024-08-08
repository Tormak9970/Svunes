<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  export let display = "inline-flex";
  export let extraOptions: HTMLButtonAttributes = {};
  export let iconType: "none" | "left" | "full" = "none";
  export let type: "elevated" | "filled" | "tonal" | "outlined" | "text";
  export let size = "2.5rem";
  export let iconSize = "1.5rem";
  export let disabled = false;

  let innerButton: HTMLButtonElement;

  export function getButtonElement(): HTMLButtonElement {
    return innerButton;
  }
</script>

<button
  bind:this={innerButton}
  on:click|stopPropagation
  {disabled}
  class="m3-container m3-font-label-large font-label {type} icon-{iconType}"
  style:--size={size}
  style:--icon-size={iconSize}
  style="display: {display};"
  {...extraOptions}
>
  <div class="layer" />
  <slot />
</button>

<style>
  :root {
    --m3-button-shape: var(--m3-util-rounding-full);
  }

  .m3-container {
    border: none;
    height: var(--size);
    padding: 0 1.5rem;
    border-radius: var(--m3-button-shape);
    color: rgb(var(--text-color));
    transition: background-color 0.2s ease-out, color 0.2s ease-out, box-shadow 0.2s ease-out;

    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .layer {
    position: absolute;
    inset: 0;
    transition: background-color 0.2s ease-out;
  }

  .m3-container > :global(*) {
    flex-shrink: 0;
  }
  .icon-left {
    padding-left: 1rem;
    gap: 0.5rem;
  }
  .icon-left > :global(svg) {
    width: 1.125rem;
    height: 1.125rem;
  }
  .icon-full {
    width: var(--size);
    padding: 0;
  }
  .icon-full :global(svg) {
    width: var(--icon-size);
    height: var(--icon-size);
  }

  .m3-container:disabled {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
    color: rgb(var(--m3-scheme-on-surface) / 0.38);
    cursor: auto;
  }

  .m3-container:enabled.elevated {
    background-color: rgb(var(--m3-scheme-surface-container-low));
    --text-color: var(--m3-scheme-primary);
    box-shadow: var(--m3-util-elevation-1);
  }

  .m3-container:enabled.filled {
    background-color: rgb(var(--m3-scheme-primary));
    --text-color: var(--m3-scheme-on-primary);
  }

  .m3-container:enabled.tonal {
    background-color: rgb(var(--m3-scheme-secondary-container));
    --text-color: var(--m3-scheme-on-secondary-container);
  }

  .m3-container.outlined {
    background-color: transparent;
    border: 0.0625rem solid rgb(var(--m3-scheme-on-surface) / 0.12);
  }
  .m3-container:enabled.outlined {
    border: 0.0625rem solid rgb(var(--m3-scheme-outline));
    --text-color: var(--m3-scheme-primary);
  }

  .m3-container.text {
    background-color: transparent;
    padding: 0 0.75rem;
    --text-color: var(--m3-scheme-primary);
  }
  .m3-container.text.icon-left {
    padding-right: 1rem;
  }

  .m3-container {
    -webkit-tap-highlight-color: transparent;
  }
  @media (hover: hover) {
    .m3-container:enabled:hover > .layer {
      background-color: rgb(var(--text-color) / 0.08);
    }
    .m3-container:enabled.elevated:hover {
      box-shadow: var(--m3-util-elevation-2);
    }
    .m3-container:enabled.filled:hover {
      box-shadow: var(--m3-util-elevation-1);
    }
    .m3-container:enabled.tonal:hover {
      box-shadow: var(--m3-util-elevation-1);
    }
  }
  .m3-container:enabled:focus-visible > .layer,
  .m3-container:enabled:active > .layer {
    background-color: rgb(var(--text-color) / 0.12);
  }
</style>