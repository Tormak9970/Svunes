<script lang="ts">
  import { debounce } from "@utils";
  import { createEventDispatcher } from "svelte";
  import type { HTMLAttributes, HTMLInputAttributes } from "svelte/elements";
  import { spring } from "svelte/motion";

  const dispatch = createEventDispatcher();

  export let extraWrapperOptions: HTMLAttributes<HTMLDivElement> = {};
  export let extraOptions: HTMLInputAttributes = {};
  export let value: number;
  export let min = 0;
  export let max = 100;
  export let step: number | "any" = "any";
  export let disabled = false;
  export let trackWidth = "0.4rem";
  export let thumbSize = "1rem";
  export let trackGap = "0.75rem";
  export let trackContainerColor = "var(--m3-scheme-primary-container)";
  export let trackColor = "var(--m3-scheme-primary)";

  function setValue(newValue: number) {
    value = newValue;
    dispatch("change", newValue);
  }

  // @ts-expect-error we're binding context to ensure that the slider's value gets set, but ts won't be happy
  const debouncedSet = debounce(setValue.bind(this), 100);

  export const valueDisplayed = spring(value, { stiffness: 0.3, damping: 1 });

  $: valueDisplayed.set(value, { hard: true });

  function updateValue(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const newValue = Number(e.currentTarget.value);
    e.preventDefault();
    debouncedSet(newValue);
    $valueDisplayed = newValue;
  };

  let range: number, percent: number;
  $: {
    range = max - min;
    percent = ($valueDisplayed - min) / range;
  }
</script>

<div class="m3-container" style:--percent="{percent * 100}%" style:--track-width={trackWidth} style:--thumb-size={thumbSize} style:--track-gap={trackGap} style:--track-container-color={trackContainerColor} style:--track-color={trackColor} {...extraWrapperOptions}>
  <input
    type="range"
    on:input={updateValue}
    value={$valueDisplayed}
    {min}
    {max}
    {step}
    {disabled}
    {...extraOptions}
  />
  <div class="track" />
  <div class="thumb" />
</div>

<style>
  :root {
    --m3-slider-track-out-shape: 0.5rem;
    --m3-slider-track-in-shape: 0.125rem;
    --m3-slider-thumb-shape: var(--m3-util-rounding-full);
  }
  .m3-container {
    position: relative;
    min-height: 8rem;
    width: 2rem;
  }
  input {
    position: absolute;
    top: -0.5rem;
    bottom: -0.5rem;
    height: calc(100% + 1rem);
    width: 100%;

    opacity: 0;
    appearance: none;
    margin: 0;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;

    writing-mode: vertical-lr;
    direction: rtl;
  }

  .track::before {
    position: absolute;
    content: " ";
    bottom: 0;
    right: 50%;
    translate: 50% 0;
    height: calc(var(--percent) - var(--track-gap));
    width: var(--track-width);
    pointer-events: none;

    background-color: rgb(var(--track-color));
    border-start-start-radius: var(--m3-slider-track-in-shape);
    border-start-end-radius: var(--m3-slider-track-in-shape);
    border-end-start-radius: var(--m3-slider-track-out-shape);
    border-end-end-radius: var(--m3-slider-track-out-shape);
  }
  .track::after {
    position: absolute;
    content: " ";
    top: 0;
    right: 50%;
    translate: 50% 0;
    height: calc(100% - var(--percent) - var(--track-gap));
    width: var(--track-width);
    pointer-events: none;

    background-color: rgb(var(--track-container-color));
    border-start-start-radius: var(--m3-slider-track-out-shape);
    border-start-end-radius: var(--m3-slider-track-out-shape);
    border-end-start-radius: var(--m3-slider-track-in-shape);
    border-end-end-radius: var(--m3-slider-track-in-shape);
  }

  .thumb {
    position: absolute;
    bottom: var(--percent);
    right: 50%;
    translate: 50% 50%;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background-color: rgb(var(--track-color));

    pointer-events: none;
    transition:
      height 200ms,
      width 200ms;
  }

  input:focus-visible ~ .thumb {
    outline: auto;
    outline-offset: 0.5rem;
  }

  input:disabled {
    cursor: auto;
  }
  input:disabled ~ .track::before {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.38);
  }
  input:disabled ~ .track::after {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.12);
  }
  input:disabled ~ .thumb {
    background-color: rgb(var(--m3-scheme-on-surface) / 0.38);
  }
</style>