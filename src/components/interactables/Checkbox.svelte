<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  export let display = "inline-flex";
  export let extraOptions: HTMLAttributes<HTMLLabelElement> = {};
  export let checked = false;
  export let disabled = false;
</script>

<label class="m3-container" style="display: {display};" {...extraOptions}>
  <input type="checkbox" bind:checked={checked} on:input disabled={disabled} />
  <div class="layer">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 4.83 13.41 L 9 17.585 L 19.59 7"
        fill="none"
        stroke="currentColor"
        stroke-width="1.41"
      />
    </svg>
  </div>
</label>

<style>
  .m3-container {
    position: relative;
    width: 1.125rem;
    height: 1.125rem;
  }
  .m3-container input {
    position: absolute;
    opacity: 0;
  }
  .layer {
    position: absolute;
    inset: -0.6875rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--m3-util-rounding-full);

    transition: background-color 200ms;
    cursor: pointer;
    --color: var(--m3-scheme-on-surface-variant);
    -webkit-tap-highlight-color: transparent;
  }
  .layer::before {
    content: " ";
    display: block;
    position: absolute;
    inset: 0.6875rem;
    border-radius: 0.125rem;
    border: solid 0.125rem rgb(var(--color));
    transition: background-color 200ms, border-color 200ms;
  }
  svg {
    position: absolute;
    inset: 0.6875rem;
    color: rgb(var(--m3-scheme-on-primary));
    opacity: 0;
    transition: opacity 200ms;
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
  input:checked + .layer {
    --color: var(--m3-scheme-primary);
  }
  input:checked + .layer::before {
    background-color: rgb(var(--color));
  }
  input:checked + .layer svg {
    opacity: 1;
  }

  input:disabled + .layer {
    background-color: transparent;
    --color: var(--m3-scheme-on-surface) / 0.38;
    pointer-events: none;
  }
  input:disabled + .layer svg {
    color: rgb(var(--m3-scheme-surface));
  }
  input:disabled:checked + .layer::before {
    border-color: transparent;
  }
</style>