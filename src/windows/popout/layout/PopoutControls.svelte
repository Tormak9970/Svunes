<script lang="ts">
  import { Icon } from "@component-utils";
  import { PopoutReciever } from "@controllers";
  import { Pause, Play, Repeat, SkipNext, SkipPrevious } from "@icons";
  import { Button, ToggleShuffleButton } from "@interactables";
  import { isPausedPopout, repeatPlayedPopout, shufflePopout } from "@stores/Popout";

  export let useTextColor = false;

  $: disabledColor = useTextColor ? "rgb(var(--m3-scheme-on-background) / 0.2)" : "rgb(var(--m3-scheme-outline-variant))";
  $: enabledColor = useTextColor ? "rgb(var(--m3-scheme-on-background))" : "rgb(var(--m3-scheme-primary))";

</script>

<div class="player-controls">
  <ToggleShuffleButton bind:shuffle={$shufflePopout} />
  <Button type="text" iconType="full" size="2.5rem" iconSize="2rem" on:click={PopoutReciever.skipBack}>
    <div class="button-icon-wrapper" style:color={enabledColor}>
      <Icon icon={SkipPrevious} />
    </div>
  </Button>
  <span class:change-play-color={useTextColor}>
    <Button type="filled" iconType="full" size="2.5rem" iconSize="2rem" on:click={() => $isPausedPopout = !$isPausedPopout}>
      {#if !$isPausedPopout}
        <Icon icon={Pause} />
      {:else}
        <Icon icon={Play} />
      {/if}
    </Button>
  </span>
  <Button type="text" iconType="full" size="2.5rem" iconSize="2rem" on:click={PopoutReciever.skip}>
    <div class="button-icon-wrapper" style:color={enabledColor}>
      <Icon icon={SkipNext} />
    </div>
  </Button>
  <Button type="text" iconType="full" size="2rem" iconSize="1.4rem" on:click={() => $repeatPlayedPopout = !$repeatPlayedPopout }>
    <div class="button-icon-wrapper" style:color={$repeatPlayedPopout ? enabledColor : disabledColor}>
      <Icon icon={Repeat} />
    </div>
  </Button>
</div>

<style>
  .player-controls {
    width: 100%;

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