<script lang="ts">
  import { onMount } from "svelte";
  import type { HTMLAttributes, HTMLInputAttributes } from "svelte/elements";

  export let display = "inline-flex";
  export let extraWrapperOptions: HTMLAttributes<HTMLDivElement> = {};
  export let extraOptions: HTMLInputAttributes = {};
  export let placeholder: string;

  export let focusOnMount = true;
  export let disabled = false;
  export let required = false;
  export let error = false;
  export let value = "";
  const id = crypto.randomUUID();

  let inputElem: HTMLInputElement;

  onMount(() => {
    if (focusOnMount) inputElem.focus();
  });
</script>

<div
  class="m3-container"
  class:error
  style="display: {display}"
  {...extraWrapperOptions}
>
  <input
    class="m3-font-body-large"
    autocomplete="off"
    placeholder={placeholder}
    bind:value
    {id}
    {disabled}
    {required}
    {...extraOptions}
    on:change
    on:input
    bind:this={inputElem}
  />
</div>

<style>
  :root {
    --m3-textfield-outlined-shape: var(--m3-util-rounding-extra-small);
  }
  .m3-container {
    position: relative;
    align-items: center;
    height: 40px;
    min-width: 15rem;
    width: 100%;
  }
  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 1rem;
    border-radius: var(--m3-textfield-outlined-shape);
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
  }
  .layer {
    position: absolute;
    inset: 0;
    border: 0.0625rem solid rgb(var(--error, var(--m3-scheme-outline)));
    border-radius: var(--m3-textfield-outlined-shape);
    pointer-events: none;
    transition: all 200ms;
  }
  .m3-container :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
    color: rgb(var(--m3-scheme-on-surface-variant));
    pointer-events: none;
  }
  .m3-container > :global(.leading) {
    position: relative;
    margin-left: 0.75rem;
  }
  .trailing {
    position: absolute;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    height: 100%;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;

    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    transition: all 200ms;
  }

  .error {
    --error: var(--m3-scheme-error);
  }

  input:disabled {
    color: rgb(var(--m3-scheme-on-surface) / 0.38);
  }
</style>