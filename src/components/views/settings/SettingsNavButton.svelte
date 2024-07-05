<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import type { IconifyIcon } from "@iconify/types";
  import CardClickable from "@layout/CardClickable.svelte";
  import { push } from "svelte-spa-router";

  export let label: string;
  export let route: string;
  export let description: string;
  export let icon: IconifyIcon;
  export let color: string;
</script>

<CardClickable type="transparent" on:click={() => push(route)} extraOptions={{ style: "width: calc(100% - 10px); display: flex; position: relative; padding: 10px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="icon-container" style:--color={color} style:--background-color={color + "30"}>
      <Icon icon={icon} height="22px" width="22px" />
    </div>
    <div class="info">
      <div>{label}</div>
      <div class="description">
        {description}
      </div>
    </div>
  </div>
</CardClickable>

<style>
  .content {
    width: 100%; 
    display: flex;
    align-items: center;
  }

  .icon-container {
    height: 40px;
    width: 40px;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--color);
    background-color: var(--background-color);

    margin-right: 15px;
  }

  .icon-container :global(svg) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    width: calc(100% - 75px);
  }
  
  .description {
    color: rgb(var(--m3-scheme-outline));
    font-size: 14px;
  }
</style>