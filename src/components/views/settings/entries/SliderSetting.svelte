<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import type { IconifyIcon } from "@iconify/types";
  import Slider from "@interactables/Slider.svelte";
  import Card from "@layout/Card.svelte";
  import type { Spring } from "svelte/motion";

  export let label: string;
  export let description: string;
  export let icon: IconifyIcon | undefined = undefined;
  export let value: number;
  export let min = 0;
  export let max = 100;
  export let step = 1;

  let valueDisplayed: Spring<number>;
</script>

<Card type="transparent" extraOptions={{ style: "width: calc(100% - 10px); display: flex; position: relative; padding: 10px; padding-left: 5px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="icon-container">
      {#if icon}
        <Icon icon={icon} height="22px" width="22px" />
      {/if}
    </div>
    <div class="info">
      <div>{label}</div>
      <div class="description">
        {description}
      </div>
      <div class="slider-container">
        <div style="width: 90%;">
          <Slider min={min} max={max} step={step} bind:value={value} bind:valueDisplayed={valueDisplayed} />
        </div>
        <div style="width: 10%;">{$valueDisplayed?.toFixed(0)}</div>
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
    height: 40px;
    width: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 15px;
  }

  .icon-container :global(svg) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    width: calc(100% - 117px);
    margin-right: 10px;
  }
  
  .description {
    color: rgb(var(--m3-scheme-outline));
    font-size: 14px;
  }

  .slider-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 15px;
  }
</style>