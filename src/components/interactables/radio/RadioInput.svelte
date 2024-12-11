<!-- @component Must be wrapped in a `<label>`. This is because clicking on a label passes the click event to the radio input. -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  const dispatch = createEventDispatcher();

  export let checked = false;
  export let disabled = false;
  export let name: string;
  export let display = "inline-flex";
  export let extraOptions: HTMLAttributes<HTMLDivElement> = {};

  /**
   * Relay the input event to the parent.
   */
  function onInput() {
    dispatch("input");
  }
</script>

<div class="m3-container" style="display: {display};" {...extraOptions}>
  <input type="radio" name={name} checked={checked} {disabled} on:input={onInput} />
  <div class="layer" />
</div>

<style>
  .m3-container {
    position: relative;
    width: 1.25rem;
    height: 1.25rem;
  }
  .m3-container input {
    position: absolute;
    opacity: 0;
  }
  .layer {
    position: absolute;
    inset: -0.625rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--m3-util-rounding-full);
    transition: all 200ms;
    cursor: pointer;
    --color: var(--m3-scheme-on-surface-variant);
    -webkit-tap-highlight-color: transparent;
  }
  .layer::before {
    content: " ";
    display: block;
    position: absolute;
    inset: 0.625rem;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: var(--m3-util-rounding-full);
    border: solid 0.125rem rgb(var(--color));
    transition: all 0.3s;
  }
  .layer::after {
    content: " ";
    display: block;
    position: absolute;
    inset: 1.25rem;
    width: 0rem;
    height: 0rem;
    border-radius: var(--m3-util-rounding-full);
    background-color: rgb(var(--color));
    transition: all 0.3s;
  }

  @media (hover: hover) {
    .layer:hover {
      --color: var(--m3-scheme-on-surface);
      background-color: rgb(var(--color) / 0.08);
    }
  }
  .layer:active,
  input:focus-visible + .layer {
    --color: var(--m3-scheme-on-surface);
    background-color: rgb(var(--color) / 0.12);
  }
  input:enabled + .layer:active::before {
    transform: scale(0.9);
  }
  input:checked + .layer {
    --color: var(--m3-scheme-primary);
  }
  input:checked + .layer::after {
    inset: 0.9375rem;
    width: 0.625rem;
    height: 0.625rem;
  }

  input:disabled + .layer {
    background-color: transparent;
    --color: var(--m3-scheme-on-surface) / 0.38;
    pointer-events: none;
  }
</style>