<script lang="ts">
  import { DetailsBody, Icon, OverlayHeader } from "@component-utils";
  import { isScrolled } from "@directives";
  import { BackArrow, DeleteSweep } from "@icons";
  import { Button } from "@interactables";
  import { t } from "@stores/Locale";
  import { showMiniPlayer, showQueue } from "@stores/Overlays";
  import { queue, songsMap } from "@stores/State";
  import { formatTime } from "@utils";
  import { pop } from "svelte-spa-router";
  import QueueSongs from "../overlays/queue/QueueSongs.svelte";

  let highlight = true;

  $: queueLength = $queue.reduce((total, id) => total + $songsMap[id].length, 0);

  /**
   * Closes the details overlay.
   */
  function back() {
    $showMiniPlayer = false;
    $showQueue = false;
    pop();
  }
</script>

<div class="holder">
  <DetailsBody>
    <span slot="header">
      <OverlayHeader highlight={highlight}>
        <span slot="left" class="header">
          <Button type="text" iconType="full" on:click={back}>
            <Icon icon={BackArrow} width="20px" height="20px" />
          </Button>
          <div class="info">
            <div class="font-headline-small">{$t("QUEUE_TITLE")}</div>
            <div class="font-label-subtitle">{$t("UP_NEXT_MESSAGE")} • {formatTime(queueLength)}</div>
          </div>
        </span>
        <span slot="right">
          <Button type="text" iconType="full" on:click={() => $queue = []}>
            <Icon icon={DeleteSweep} width="20px" height="20px" />
          </Button>
        </span>
      </OverlayHeader>
    </span>
    <span class="content" slot="content">
      <div class="content-inner styled-scrollbar" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
        <QueueSongs />
      </div>
    </span>
  </DetailsBody>
</div>

<style>
  .holder {
    width: 100%;
    height: 100%;

    position: absolute;
    
    background-color: transparent;
    z-index: 3;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .content-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
  }
</style>