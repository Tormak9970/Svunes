<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Toggle from "@interactables/Toggle.svelte";
  import Card from "@layout/Card.svelte";
  import Icon from "../../../utils/Icon.svelte";

  export let label: string;
  export let description: string;
  export let icon: IconifyIcon | undefined = undefined;
  export let checked: boolean;
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
    </div>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="toggle-container">
      <Toggle bind:checked={checked} />
    </label>
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

  .toggle-container {
    align-self: center;
  }
</style>