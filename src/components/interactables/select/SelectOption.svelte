<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let selected: boolean = false;
  export let value: string;
  export let disabled = false;
  export let width: number;

  function handleClick() {
    dispatch("click", { value: value });
  }
</script>

<button class="item m3-font-label-large" style:width="calc({width}px - 1.5rem)" class:selected {disabled} on:click={handleClick}>
  <slot />
</button>

<style>
  .item {
    display: flex;
    align-items: center;
    height: 3rem;
    padding: 0 0.75rem;
    white-space: nowrap;
    width: calc(100% - 1.5rem);

    border: none;
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    transition: background-color 200ms;
  }

  .item:enabled:hover {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.08);
  }
  .item:enabled:active,
  .item:enabled:focus-visible {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }
  .item:disabled {
    color: rgb(var(--m3-scheme-on-surface) / 0.38);
    cursor: auto;
  }

  .selected {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }
  .item:enabled:hover,
  .selected:enabled:active,
  .selected:enabled:focus-visible {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.16);
  }
</style>