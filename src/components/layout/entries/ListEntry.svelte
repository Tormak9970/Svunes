<script lang="ts">
  import { ViewImage } from "@component-utils";
  import { inSelectMode } from "@stores/Select";
  import { LIST_IMAGE_DIMENSIONS } from "@utils";
  import CardClickable from "../CardClickable.svelte";

  export let label: string;
  export let convertedPath: string;
  export let highlighted: boolean;
  export let borderRadius = "4px";
  export let isSongEntry = false;
  export let holdable = true;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} holdable={holdable} on:click on:hold extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:in-select-mode={$inSelectMode}>
    <div class="left" class:has-options={$$slots.options}>
      {#if $$slots.playlistImage}
        <slot name="playlistImage" />
      {:else}
        <ViewImage
          src={convertedPath}
          width={LIST_IMAGE_DIMENSIONS.width}
          height={LIST_IMAGE_DIMENSIONS.height}
          borderRadius={borderRadius}
          marginLeft="10px"
        />
      {/if}
      <div class="info" class:is-song-entry={isSongEntry}>
        <div class="font-label name">
          {label}
        </div>
        {#if $$slots.details}
          <div class="font-body secondary">
            <slot name="details" />
          </div>
        {/if}
      </div>
    </div>
    {#if $$slots.options && !$inSelectMode}
      <div class="options">
        <slot name="options" />
      </div>
    {/if}
  </div>
</CardClickable>

<style>
  .content {
    width: 100%; 
    display: flex;
    align-items: center;
  }

  .left {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .left.has-options {
    width: calc(100% - 40px);
  }

  .info {
    max-width: calc(100% - 75px);
    margin-left: 15px;
  }

  .in-select-mode .info {
    width: 100%;
  }

  .in-select-mode .is-song-entry.info,
  .is-song-entry.info {
    width: calc(100% - 50px);
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