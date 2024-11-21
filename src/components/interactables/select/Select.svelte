<script lang="ts">
  import { Icon } from "@component-utils";
  import type { HTMLAttributes } from "svelte/elements";
  
  import { ArrowDropDown, ArrowDropUp } from "@icons";
  import { onMount } from "svelte";
  import SelectOption from "./SelectOption.svelte";

  const id = crypto.randomUUID();

  export let extraWrapperOptions: HTMLAttributes<HTMLDivElement> = {};
  export let extraOptions: HTMLAttributes<HTMLDivElement> = {};
  export let name: string;

  export let disabled = false;
  export let value = "";
  export let options: SelectItem[];
  export let open = false;
  export let maxHeight = "300px";

  $: menuElement && (menuElement.open = open);
  $: label = options.find((option) => option.value === value)?.label;

  let selectElement: HTMLDivElement;
  let menuElement: any;


  function onMouseUp(e: Event) {
    if (e.target !== selectElement) open = false;
  }

  function onClick(e: Event) {
    open = !open;
  }

  function handleClick(e: any) {
    value = e.detail.value;
  }

  onMount(() => {
    menuElement.anchorElement = selectElement;

    const shadowRoot = menuElement.shadowRoot;
    const style = document.createElement('style');
    style.innerHTML = `
    .items {
      scrollbar-width: none;
    }
    `
    shadowRoot.insertBefore(style, shadowRoot.firstChild);
  });
</script>

<svelte:window on:mouseup={onMouseUp} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="container"
  on:click|stopPropagation
  on:mousedown|stopPropagation
  style:--md-menu-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-selected-container-color="rgb(var(--m3-scheme-secondary-container))"
>
  <div
    class="m3-container"
    class:focus={open}
    class:disabled
    class:empty={!label}
    {...extraWrapperOptions}
    on:click={onClick}
    on:mouseup|stopPropagation
    bind:this={selectElement}
  >
    <div class="select-mimic m3-font-body-large" {id} {...extraOptions}>
      <div class="current-label">{label}</div>
    </div>
    <div class="layer" />
    <label class="m3-font-body-large" for={id}>{name}</label>
    <div class="trailing">
      {#if open}
        <Icon icon={ArrowDropUp} />
      {:else}
        <Icon icon={ArrowDropDown} />
      {/if}
    </div>
  </div>
  <md-menu positioning="popover" style:max-height={maxHeight} bind:this={menuElement}>
    {#each options as option}
      <SelectOption value={option.value} selected={value === option.value} width={selectElement?.clientWidth} on:click={handleClick}>{option.label}</SelectOption>
    {/each}
  </md-menu>
</div>

<style>
  :root {
    --m3-textfield-outlined-shape: var(--m3-util-rounding-extra-small);
  }
  .m3-container {
    position: relative;
    align-items: center;
    height: 3.5rem;
    min-width: 15rem;
    width: 100%;
    
    cursor: pointer;

    display: inline-flex;
  }
  .select-mimic {
    width: calc(100% - 3rem);
    height: 100%;
    padding-left: 0.75rem;
    color: rgb(var(--m3-scheme-on-surface));
    
    display: flex;
    align-items: center;
  }
  .current-label {
    max-width: 260px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  label {
    position: absolute;
    left: 0.75rem;
    top: 1rem;
    color: rgb(var(--error, var(--m3-scheme-on-surface-variant)));
    background-color: rgb(var(--m3-util-background, var(--m3-scheme-surface-container-high)));
    padding: 0 0.25rem;
    pointer-events: none;
    transition:
      all 200ms,
      font-size 300ms,
      line-height 300ms,
      letter-spacing 300ms;
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
  .trailing {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: transparent;
  }

  .m3-container.focus label,
  .m3-container:not(.empty) label {
    top: calc(var(--m3-font-body-small-height, 1rem) * -0.5);
    font-size: var(--m3-font-body-small-size, 0.85rem);
    line-height: var(--m3-font-body-small-height, 1rem);
    letter-spacing: var(--m3-font-body-small-tracking, 0.4);
  }
  .m3-container:hover label {
    color: rgb(var(--error, var(--m3-scheme-on-surface)));
  }
  .m3-container:hover .layer {
    border-color: rgb(var(--error, var(--m3-scheme-on-surface)));
  }
  .m3-container.focus label {
    color: rgb(var(--error, var(--m3-scheme-primary)));
  }
  .m3-container.focus .layer {
    border-color: rgb(var(--error, var(--m3-scheme-primary)));
    border-width: 0.125rem;
  }

  .m3-container:hover :global(svg) { color: rgb(var(--m3-scheme-on-surface)); }
  .m3-container.focus :global(svg) { color: rgb(var(--m3-scheme-primary)); }

  .disabled { pointer-events: none; }
  .disabled .select-mimic {color: rgb(var(--m3-scheme-on-surface) / 0.38); }
  .disabled label {color: rgb(var(--m3-scheme-on-surface) / 0.38); }
  .disabled .layer { border-color: rgb(var(--m3-scheme-on-surface) / 0.38); }
  .disabled :global(svg) { color: rgb(var(--m3-scheme-on-surface) / 0.38); }
</style>