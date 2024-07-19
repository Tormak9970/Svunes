<script lang="ts">
  import BottomSheet from "@layout/BottomSheet.svelte";
  import ListItemButton from "@layout/ListItemButton.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import { t } from "@stores/Locale";
  import { showSleepTimerSelection } from "@stores/Overlays";
  import { isPaused, shouldPauseOnEnd, showInfoSnackbar } from "@stores/State";
  import { SleepTimerOption, getTimeForOption, getTimeOptionLabel } from "../../types/SleepTimer";

  /**
   * Sets the selected sleep timer.
   */
  function setTimer(option: SleepTimerOption) {
    if (option === SleepTimerOption.END_OF_TRACK) {
      $shouldPauseOnEnd = true;
    } else {
      setTimeout(() => {
        $isPaused = true;
      }, getTimeForOption(option));
    }

    LogController.log(`Set a ${option} sleep timer.`);
    $showInfoSnackbar({ message: $t("TIMER_SET_MESSAGE") });

    close();
  }

  /**
   * Closes the overlay.
   */
  function close() {
    $showSleepTimerSelection = false;
  }
  
  const options = Object.values(SleepTimerOption).filter((v) => !isNaN(Number(v))) as SleepTimerOption[];
</script>

<BottomSheet on:close={close}>
  <div class="content" style:--m3-util-background="var(--m3-scheme-surface-container-low)">
    <div class="header">
      <div class="header-text font-label">{$t("STOP_AUDIO_IN_TITLE")}</div>
    </div>
    {#each options as option}
      <ListItemButton headline={getTimeOptionLabel(option)} extraOptions={{ style: "width: 100%" }} on:click={() => setTimer(option)} />
    {/each}
  </div>
</BottomSheet>

<style>
  .content {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding-bottom: 10px;
  }

  .header {
    border-bottom: 1px solid rgb(var(--m3-scheme-surface-container-high));
    width: 100%;
    text-align: center;

    display: flex;
    justify-content: center;

    font-weight: bold;
  }

  .header-text {
    margin-top: 5px;
    margin-bottom: 10px;
    font-weight: bold;
  }
</style>