<script lang="ts">
  import { Icon } from "@component-utils";
  import type { IconifyIcon } from "@iconify/types";
  import { CardClickable } from "@layout";

  export let label: string;
  export let description: string;
  export let icon: IconifyIcon | undefined = undefined;
</script>

<CardClickable type="transparent" on:click extraOptions={{ style: "width: calc(100% - 10px); display: flex; position: relative; padding: 10px; padding-left: 0px; border-radius: 10px; margin: 2px 0px;" }}>
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
    height: 50px;
    width: 50px;
    border-radius: 50%;

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
</style>