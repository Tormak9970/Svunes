<script lang="ts">
  import { Icon } from "@component-utils";
  import type { IconifyIcon } from "@iconify/types";
  import { Slider } from "@interactables";
  import { Card } from "@layout";
  import type { Spring } from "svelte/motion";

  export let label: string;
  export let description: string;
  export let icon: IconifyIcon | undefined = undefined;
  export let value: number;
  export let min = 0;
  export let max = 100;
  export let step = 1;

  export let leftLabel: string | undefined = undefined;
  export let rightLabel: string | undefined = undefined;

  let valueDisplayed: Spring<number>;
</script>

<Card type="transparent" extraOptions={{ style: "width: calc(100% - 10px); display: flex; position: relative; padding: 10px; padding-left: 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="icon-container">
      {#if icon}
        <Icon icon={icon} height="24px" width="24px" />
      {/if}
    </div>
    <div class="info">
      <div class="font-label">{label}</div>
      <div class="font-body description">
        {description}
      </div>
      <div class="slider-container">
        <div class="bound-label">{leftLabel ?? min}</div>
        <div style="width: 90%;">
          <Slider min={min} max={max} step={step} bind:value={value} bind:valueDisplayed={valueDisplayed} />
        </div>
        <div class="bound-label">{rightLabel ?? max}</div>
      </div>
    </div>
  </div>
</Card>

<style>
  .content {
    width: 100%; 
    display: flex;
  }

  .icon-container {
    height: 50px;
    width: 50px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 10px;
  }

  .icon-container :global(svg) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    max-width: 50rem;
  }
  
  .description {
    color: rgb(var(--m3-scheme-outline));
  }

  .slider-container {
    width: 24rem;
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .bound-label {
    padding: 0rem 0.5rem;
  }
</style>