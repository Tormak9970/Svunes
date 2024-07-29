<script lang="ts">
  import ViewImage from "@component-utils/ViewImage.svelte";
  import CardClickable from "@layout/CardClickable.svelte";
  import { inSelectMode } from "@stores/Select";
  import { GridSize } from "@types";
  import { GRID_IMAGE_DIMENSIONS } from "@utils";

  export let label: string;
  export let gridSize: GridSize;
  export let convertedPath: string;
  export let highlighted: boolean;
  export let borderRadius = "10px";
  export let centerLabel = false;

  $: size = gridSize === GridSize.MEDIUM ? 40 : 60;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} on:click on:hold extraOptions={{ style: "width: 100%; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:highlight={highlighted}>
    {#if $$slots.playlistImage}
      <slot name="playlistImage" />
    {:else}
      <ViewImage
        src={convertedPath}
        width={GRID_IMAGE_DIMENSIONS[gridSize].width}
        height={GRID_IMAGE_DIMENSIONS[gridSize].height}
        iconSize={size}
        borderRadius={borderRadius}
      />
    {/if}
    <div class="bottom" style="height: {GRID_IMAGE_DIMENSIONS[gridSize].infoHeight}px;" class:expand={$inSelectMode || gridSize !== GridSize.LARGE || !$$slots.options}>
      <div class="info" class:center-label={centerLabel}>
        <div class="font-label name">
          {label}
        </div>
        {#if $$slots.details}
          <div class="font-body secondary">
            <slot name="details" />
          </div>
        {/if}
      </div>
      {#if $$slots.options && !$inSelectMode && gridSize === GridSize.LARGE}
        <div class="options">
          <slot name="options" />
        </div>
      {/if}
    </div>
  </div>
</CardClickable>

<style>
  .content {
    width: calc(100% - 10px); 
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bottom {
    padding-top: 9px;
    padding-bottom: 4px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    width: calc(100% - 40px);
    margin-right: 5px;
  }

  .expand .info,
  .center-label.info {
    margin-right: 0px;
    width: 100%;
  }

  .center-label.info {
    display: flex;
    justify-content: center;
  }

  .name {
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .secondary {
    color: rgb(var(--m3-scheme-outline));
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>