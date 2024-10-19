<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let src: string;
  export let height: number = 0;
  export let width: number = 0;
  export let clickable = false;
  
  const dispatch = createEventDispatcher();

  let loaded = false;
  let failed = false;

  $: showPlaceholder = !loaded || failed;

  $: styleHeight = height !== 0 ? `${height}px` : "auto";
  $: styleWidth = width !== 0 ? `${width}px` : "auto";

  const load = () => loaded = true;
  const onError = () => failed = true;
</script>

<div
  class="lazy-container"
  style:max-height={styleHeight}
  style:min-height={showPlaceholder ? "100%" : undefined}
  style:max-width={styleWidth}
  style:min-width={showPlaceholder ? "100%" : undefined}
>
  {#if clickable}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="click-container" on:click={() => dispatch("click")} />
  {/if}
  {#if showPlaceholder}
    <div class="placeholder-container">
      <slot />
    </div>
  {/if}
  <!-- svelte-ignore a11y-missing-attribute -->
  <img
    src={src}
    style:opacity={showPlaceholder ? "0" : "1"}
    draggable="false"
    on:load={load}
    on:error={onError}
  />
</div>

<style>
  .lazy-container {
    position: relative;
    max-height: 100%;
    max-width: 100%;
  }

  .click-container {
    position: absolute;
    top: 0;

    cursor: pointer;

    width: 100%;
    height: 100%;

    z-index: 2;

    background-color: transparent;
    transition: background-color 0.2s ease-in-out;
  }

  .placeholder-container {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;

    z-index: 1;

    background-color: transparent;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    height: auto;
    max-height: 100%;
    width: auto;
    max-width: 100%;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    transition: opactiy 0.2s ease-out;
  }

  .lazy-container:hover .click-container {
    background-color: rgb(var(--m3-scheme-scrim) / 0.3);
  }
</style>