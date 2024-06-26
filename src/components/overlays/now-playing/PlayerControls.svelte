<script lang="ts">
  import { isPaused, shuffle, repeatPlayed } from "../../../stores/State";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import Button from "../../interactables/Button.svelte";
  import Icon from "../../utils/Icon.svelte";

  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import SkipPrevious from "@ktibow/iconset-material-symbols/skip-previous-rounded";
  import SkipNext from "@ktibow/iconset-material-symbols/skip-next-rounded";
  import Repeat from "@ktibow/iconset-material-symbols/repeat-rounded";

  function handlePlay() {
    if ($isPaused) {
      PlaybackController.resume();
    } else {
      PlaybackController.pause();
    }
  }
</script>

<div class="player-controls">
  <Button type="text" iconType="full" size="3rem" on:click={() => $repeatPlayed = !$repeatPlayed }>
    <div class="button-icon-wrapper" style:color={$repeatPlayed ? "rgb(var(--m3-scheme-primary))" : "rgb(var(--m3-scheme-outline-variant))"}>
      <Icon icon={Repeat} />
    </div>
  </Button>
  <Button type="text" iconType="full" size="4rem" iconSize="2.5rem" on:click={QueueController.skipBack}>
    <Icon icon={SkipPrevious} />
  </Button>
  <Button type="filled" iconType="full" size="4rem" iconSize="2.5rem" on:click={handlePlay}>
    {#if !$isPaused}
      <Icon icon={Pause} />
    {:else}
      <Icon icon={Play} />
    {/if}
  </Button>
  <Button type="text" iconType="full" size="4rem" iconSize="2.5rem" on:click={QueueController.skip}>
    <Icon icon={SkipNext} />
  </Button>
  <Button type="text" iconType="full" size="3rem" extraOptions={{ style: "display: flex;" }} on:click={() => $shuffle = !$shuffle }>
    <div class="button-icon-wrapper" style:color={$shuffle ? "rgb(var(--m3-scheme-primary))" : "rgb(var(--m3-scheme-outline-variant))"}>
      <Icon icon={Shuffle} />
    </div>
  </Button>
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
</style>