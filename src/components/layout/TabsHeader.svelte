<script context="module" lang="ts">
  export type TabItem = {
    label: string;
    value: string;
  };
</script>
<script lang="ts">
  import { Icon } from "@component-utils";
  import type { IconifyIcon } from "@iconify/types";
  import type { HTMLAttributes, HTMLInputAttributes } from "svelte/elements";

  export let extraWrapperOptions: HTMLAttributes<HTMLDivElement> = {};
  export let extraOptions: HTMLInputAttributes = {};
  export let secondary = false;
  export let tab: string;
  export let items: {
    icon?: IconifyIcon;
    label: string;
    value: string;
  }[];

  const name = crypto.randomUUID();
  function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const before = tab;
    const after = e.currentTarget.value;
    const beforeE = wrapper.querySelector(`input[value="${before}"] + label`) as HTMLInputElement;
    const afterE = wrapper.querySelector(`input[value="${after}"] + label`) as HTMLInputElement;

    const bar = wrapper.querySelector(".bar") as HTMLDivElement;
    const beforeX = beforeE.offsetLeft + 0.5 * beforeE.offsetWidth;
    const afterX = afterE.offsetLeft + 0.5 * afterE.offsetWidth;
    const deltaX = afterX - beforeX;

    if (secondary) {
      const factorX = afterE.offsetWidth / beforeE.offsetWidth;
      bar.animate(
        [
          {
            transform: `translateX(${-deltaX}px) scaleX(${1 / factorX})`,
          },
          {
            transform: `translateX(0) scaleX(1)`,
          },
        ],
        {
          duration: 300,
          easing: "ease",
        },
      );
    } else {
      bar.animate(
        [
          {
            transform: `translateX(${-deltaX}px)`,
          },
          {
            transform: `translateX(0)`,
          },
        ],
        {
          duration: 200,
          easing: "ease",
        },
      );
    }
  }

  let wrapper: HTMLDivElement;
</script>

<div
  class="m3-container"
  class:primary={!secondary}
  style:--items={items.length}
  bind:this={wrapper}
  {...extraWrapperOptions}
>
  <div class="items">
    <div class="divider" />
    {#each items as item}
      {@const id = name + item.value}
      <input
        type="radio"
        {name}
        {id}
        value={item.value}
        bind:group={tab}
        on:input={handleInput}
        {...extraOptions}
      />
      <label for={id} class:tall={item.icon}>
        {#if item.icon}
          <Icon icon={item.icon} />
        {/if}
        <span class="m3-font-title-small font-label">{item.label}</span>
      </label>
    {/each}
    <div class="bar" />
  </div>
</div>

<style>
  .m3-container {
    background-color: transparent;
    overflow-x: auto;
    width: 100%;
  }
  .items {
    display: grid;
    width: fit-content;
    min-width: 100%;

    position: relative;
    grid-template-columns: repeat(var(--items), auto);
    justify-content: start;
  }
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .divider {
    position: absolute;
    inset: auto 0 0 0;
    height: 0.0625rem;
    background-color: rgb(var(--m3-scheme-surface-container-highest));
  }
  label {
    height: 3rem;
    white-space: nowrap;
    padding: 0 1rem;

    position: relative;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    color: rgb(var(--text));
    --text: var(--m3-scheme-on-surface-variant);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;

    transition:
      background-color 200ms,
      height 200ms,
      gap 200ms;
  }
  label > :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }

  @media (hover: hover) {
    label:hover {
      --text: var(--m3-scheme-on-surface);
      background-color: rgb(var(--text) / 0.08);
    }
  }
  input:focus-visible + label,
  input:active + label {
    --text: var(--m3-scheme-on-surface);
    background-color: rgb(var(--text) / 0.12);
  }
  input:checked + label {
    --text: var(--m3-scheme-on-surface);
  }

  label,
  .bar {
    grid-row: 1;
  }
  .bar {
    background-color: rgb(var(--m3-scheme-primary));
    height: 0.125rem;
    z-index: 1;
    align-self: end;
    pointer-events: none;
  }
  label:nth-of-type(1) {
    grid-column: 1;
  }
  input:checked:nth-of-type(1) ~ .bar {
    grid-column: 1;
  }
  label:nth-of-type(2) {
    grid-column: 2;
  }
  input:checked:nth-of-type(2) ~ .bar {
    grid-column: 2;
  }
  label:nth-of-type(3) {
    grid-column: 3;
  }
  input:checked:nth-of-type(3) ~ .bar {
    grid-column: 3;
  }
  label:nth-of-type(4) {
    grid-column: 4;
  }
  input:checked:nth-of-type(4) ~ .bar {
    grid-column: 4;
  }
  label:nth-of-type(5) {
    grid-column: 5;
  }
  input:checked:nth-of-type(5) ~ .bar {
    grid-column: 5;
  }

  .primary > .items > label {
    flex-direction: column;
    gap: 0;
  }
  .primary > .items > label.tall {
    height: 4rem;
  }
  .primary > .items > label > :global(svg) {
    width: 1.5rem;
    height: 1.5rem;
  }
  .primary > .items > input:checked + label {
    --text: var(--m3-scheme-primary);
  }
  .primary > .items > .bar {
    width: 3rem;
    height: 0.1875rem;
    border-radius: 0.1875rem 0.1875rem 0 0;
    justify-self: center;
  }
</style>