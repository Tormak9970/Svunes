<script lang="ts">
  import Body from "./view-settings/Body.svelte";
  import { nowPlayingBackgroundType } from "../../stores/State";
  import { showNowPlayingBackground } from "../../stores/Modals";
  import RadioInput from "../interactables/RadioInput.svelte";
  import { NowPlayingBackgroundType, getNowPlayingBackgroundType } from "../../types/Settings";

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

<Body headline="Background Type" bind:open={$showNowPlayingBackground}>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <div class="content">
    {#each backgroundTypes as backgroundType}
      <label style="height: 2.5rem;">
        <RadioInput name="nowPlayingBackground" checked={$nowPlayingBackgroundType === backgroundType} on:input={() => setBackgroundType(backgroundType)} />
        <div class="radio">{getNowPlayingBackgroundType(backgroundType)}</div>
      </label>
    {/each}
  </div>
</Body>

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