<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Card from "../../../layout/Card.svelte";
  import Icon from "../../../utils/Icon.svelte";
  import ColorPicker from "../../../interactables/color-picker/ColorPicker.svelte";

  export let label: string;
  export let description: string;
  export let icon: IconifyIcon | undefined = undefined;
  export let color: string;
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
      <ColorPicker bind:hex={color} />
    </label>
  </div>
</Card>

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

    margin-right: 15px;
  }

  .icon-container :global(svg) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    width: calc(100% - 99px);
  }
  
  .description {
    color: rgb(var(--m3-scheme-outline));
    font-size: 14px;
  }
</style>