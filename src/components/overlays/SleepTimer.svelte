<script lang="ts">
  import BottomSheet from "@layout/BottomSheet.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import { showSleepTimerSelection } from "@stores/Overlays";
  import { isPaused, shouldPauseOnEnd, showInfoSnackbar } from "@stores/State";
  import { SleepTimerOption, getTimeForOption } from "../../types/SleepTimer";
  import ListItemButton from "../layout/ListItemButton.svelte";

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
    $showInfoSnackbar({ message: "Timer set" });

    close();
  }

  /**
   * Closes the overlay.
   */
  function close() {
    $showSleepTimerSelection = false;
  }
  
  const options: SleepTimerOption[] = Object.values(SleepTimerOption);
</script>

<BottomSheet on:close={close}>
  <div class="content" style:--m3-util-background="var(--m3-scheme-surface-container-low)">
    <div class="header">
      <div class="header-text">Stop Audio In</div>
    </div>
    {#each options as option}
      <ListItemButton headline={option} extraOptions={{ style: "width: 100%" }} on:click={() => setTimer(option)} />
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
  }
</style>