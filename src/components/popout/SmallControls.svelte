<script lang="ts">
  import { Icon } from "@component-utils";
  import { FavoriteOff, FavoriteOn, Pause, Play, Repeat, SkipNext, SkipPrevious } from "@icons";
  import { Button, ToggleShuffleButton } from "@interactables";
  import { isFavoritedPopout, isPausedPopout, repeatPlayedPopout, shufflePopout } from "@stores/Popout";
  
  import { PopoutReciever } from "@controllers";
  import { onDestroy, onMount } from "svelte";

  let container: HTMLDivElement;

  let numHidden = 0;

  let disabledColor = "rgb(var(--m3-scheme-outline-variant))";
  let enabledColor = "rgb(var(--m3-scheme-primary))";

  function calcNumHidden(width: number) {
    // ! Thresholds
    // ? width >= 228 -> controls
    // ? width >= 188 -> controls - shuffle
    // ? width >= 158 -> controls - (shuffle & loop)
    // ? width >= 120 -> controls - (shuffle & loop & skipBack)
    // ? width >= 88 -> controls - (shuffle & loop & skipBack & favorite)

    numHidden = 
      width >= 228 ? 0 :
      228 > width && width >= 188 ? 1 :
      188 > width && width >= 158 ? 2 :
      158 > width && width >= 120 ? 3 :
      4;
  }

  const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    const width = entries[0].target.clientWidth;
    calcNumHidden(width);
  });

  onMount(() => {
    observer.observe(container);
    calcNumHidden(container.clientWidth);
  });

  onDestroy(() => {
    observer.disconnect();
  });
</script>


<div class="player-controls" bind:this={container}>
  {#if numHidden < 4}
    <Button type="text" iconType="full" on:click={() => $isFavoritedPopout = !$isFavoritedPopout}>
      {#if !$isFavoritedPopout}
        <Icon icon={FavoriteOff} />
      {:else}
        <Icon icon={FavoriteOn} />
      {/if}
    </Button>
  {/if}
  {#if numHidden < 1}
    <ToggleShuffleButton bind:shuffle={$shufflePopout} />
  {/if}
  {#if numHidden < 3}
    <Button type="text" iconType="full" size="2.2rem" iconSize="2rem" on:click={PopoutReciever.skipBack}>
      <div class="button-icon-wrapper" style:color={enabledColor}>
        <Icon icon={SkipPrevious} />
      </div>
    </Button>
  {/if}
  <span style:margin="0 0.3rem">
    <Button type="filled" iconType="full" size="2.2rem" iconSize="1.8rem" on:click={() => $isPausedPopout = !$isPausedPopout}>
      {#if !$isPausedPopout}
        <Icon icon={Pause} />
      {:else}
        <Icon icon={Play} />
      {/if}
    </Button>
  </span>
  <Button type="text" iconType="full" size="2.2rem" iconSize="2rem" on:click={PopoutReciever.skip}>
    <div class="button-icon-wrapper" style:color={enabledColor}>
      <Icon icon={SkipNext} />
    </div>
  </Button>
  {#if numHidden < 2}
    <Button type="text" iconType="full" size="2rem" iconSize="1.4rem" on:click={() => $repeatPlayedPopout = !$repeatPlayedPopout }>
      <div class="button-icon-wrapper" style:color={$repeatPlayedPopout ? enabledColor : disabledColor}>
        <Icon icon={Repeat} />
      </div>
    </Button>
  {/if}
</div>

<style>
  .player-controls {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .button-icon-wrapper {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>