<script lang="ts">
  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import DeleteSweep from "@ktibow/iconset-material-symbols/delete-sweep-rounded";
  import { formatTime } from "@lib/utils/Utils";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { t } from "@stores/Locale";
  import { showMiniPlayer, showQueue } from "@stores/Overlays";
  import { queue, songsMap } from "../../../stores/State";
  import QueueSongs from "./QueueSongs.svelte";

  let isAtTop = true;

  $: queueLength = $queue.reduce((total, id) => total + $songsMap[id].length, 0);

  /**
   * Closes the details overlay.
   */
  function back() {
    $showMiniPlayer = false;
    $showQueue = false;
  }
</script>

<div class="holder">
  <DetailsBody bind:isAtTop={isAtTop}>
    <span slot="header">
      <OverlayHeader highlight={!isAtTop}>
        <span slot="left" class="header">
          <Button type="text" iconType="full" on:click={back}>
            <Icon icon={BackArrow} width="20px" height="20px" />
          </Button>
          <div class="info">
            <div class="title">{$t("QUEUE_TITLE")}</div>
            <div class="sub-title">{$t("UP_NEXT_MESSAGE")} • {formatTime(queueLength)}</div>
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
      <QueueSongs />
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

  .title {
    font-size: 18px;
  }

  .sub-title {
    font-size: 14px;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 70px;
  }
</style>