<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import { QueueController } from "@lib/controllers/QueueController";
  import { isPaused, repeatPlayed, shuffle } from "@stores/State";
  import Icon from "../../utils/Icon.svelte";

  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Repeat from "@ktibow/iconset-material-symbols/repeat-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import SkipNext from "@ktibow/iconset-material-symbols/skip-next-rounded";
  import SkipPrevious from "@ktibow/iconset-material-symbols/skip-previous-rounded";

  export let useTextColor = false;
  export let showExtraControls = true;

  $: disabledColor = useTextColor ? "rgb(var(--m3-scheme-on-background) / 0.2)" : "rgb(var(--m3-scheme-outline-variant))";
  $: enabledColor = useTextColor ? "rgb(var(--m3-scheme-on-background))" : "rgb(var(--m3-scheme-primary))";

  function handlePlay() {
    if ($isPaused) {
      PlaybackController.resume();
    } else {
      PlaybackController.pause();
    }
  }
</script>

<div class="player-controls" class:use-text-color={useTextColor}>
  {#if showExtraControls}
    <Button type="text" iconType="full" size="3rem" on:click={() => $repeatPlayed = !$repeatPlayed }>
      <div class="button-icon-wrapper" style:color={$repeatPlayed ? enabledColor : disabledColor}>
        <Icon icon={Repeat} />
      </div>
    </Button>
  {:else}
    <div style="width: 3rem; height: 3rem;" />
  {/if}
  <Button type="text" iconType="full" size="4rem" iconSize="2.5rem" on:click={QueueController.skipBack}>
    <div class="button-icon-wrapper" style:color={enabledColor}>
      <Icon icon={SkipPrevious} />
    </div>
  </Button>
  <span class:change-play-color={useTextColor}>
    <Button type="filled" iconType="full" size="4rem" iconSize="2.5rem" on:click={handlePlay}>
      {#if !$isPaused}
        <Icon icon={Pause} />
      {:else}
        <Icon icon={Play} />
      {/if}
    </Button>
  </span>
  <Button type="text" iconType="full" size="4rem" iconSize="2.5rem" on:click={QueueController.skip}>
    <div class="button-icon-wrapper" style:color={enabledColor}>
      <Icon icon={SkipNext} />
    </div>
  </Button>
  {#if showExtraControls}
    <Button type="text" iconType="full" size="3rem" extraOptions={{ style: "display: flex;" }} on:click={() => $shuffle = !$shuffle }>
      <div class="button-icon-wrapper" style:color={$shuffle ? enabledColor : disabledColor}>
        <Icon icon={Shuffle} />
      </div>
    </Button>
  {:else}
    <div style="width: 3rem; height: 3rem;" />
  {/if}
</div>

<style>
  .player-controls {
    width: 100%;
    margin-top: 10px;

    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .button-icon-wrapper {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .change-play-color {
    --m3-scheme-primary: var(--m3-scheme-on-background);
  }
</style>