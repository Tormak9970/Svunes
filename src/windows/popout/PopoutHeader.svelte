<script lang="ts">
  import { Icon } from "@component-utils";
  import { PopoutReciever } from "@controllers";
  import { Close, DragIndicator } from "@icons";
  import { Button } from "@interactables";

  export let useSideHeader: boolean;

  function closePopout() {
    PopoutReciever.closeWindow();
  }
</script>

<div class="header" class:side-header={useSideHeader} data-tauri-drag-region>
  {#if !useSideHeader}
    <div style:width="32px" style:height="32px" />
  {/if}
  <div class="drag-icon-container" style="pointer-events: none;">
    <Icon icon={DragIndicator} />
  </div>
  <Button type="text" iconType="full" size="2rem" iconSize="1.3rem" on:click={closePopout}>
    <Icon icon={Close} />
  </Button>
</div>

<style>
  .header {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    color: rgb(var(--m3-scheme-primary));
  }

  .drag-icon-container :global(svg) {
    transform: rotate(90deg);
  }

  /* ! When the popout player is too short */

  .header.side-header {
    height: 100%;
    width: 30px;
    
    flex-direction: column-reverse;
  }

  .side-header .drag-icon-container {
    margin-bottom: 0.25rem;
  }
  .side-header .drag-icon-container :global(svg) {
    transform: rotate(0deg);
  }
</style>