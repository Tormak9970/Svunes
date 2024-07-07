<script lang="ts">
  import RadioInput from "@interactables/RadioInput.svelte";
  import { showNowPlayingBackground } from "@stores/Modals";
  import { nowPlayingBackgroundType } from "@stores/State";
  import { NowPlayingBackgroundType, getNowPlayingBackgroundType } from "../../types/Settings";
  import SmallModalBody from "./utils/SmallModalBody.svelte";

  /**
   * Sets the now playing background type.
   * @param backgroundType The new background type.
   */
  function setBackgroundType(backgroundType: NowPlayingBackgroundType) {
    $nowPlayingBackgroundType = backgroundType;
    $showNowPlayingBackground = false;
  }

  const backgroundTypes: NowPlayingBackgroundType[] = Object.values(NowPlayingBackgroundType).filter((v) => !isNaN(Number(v))) as NowPlayingBackgroundType[];
</script>

<SmallModalBody headline="Background Type" open on:close={() => $showNowPlayingBackground = false}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    {#each backgroundTypes as backgroundType}
      <label style="height: 2.5rem;">
        <RadioInput name="nowPlayingBackground" checked={$nowPlayingBackgroundType === backgroundType} on:input={() => setBackgroundType(backgroundType)} />
        <div class="radio">{getNowPlayingBackgroundType(backgroundType)}</div>
      </label>
    {/each}
  </div>
</SmallModalBody>

<style>
  .content {
    display: flex;
    flex-direction: column;
  }

  label {
    display: flex;
    align-items: center;
  }

  .radio {
    margin-left: 15px;
    font-size: 16px;
  }
</style>