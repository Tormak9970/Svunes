<script lang="ts">
  import { isLandscape } from "@stores/Layout";
  import { sharedAxisTransition } from "./animations/animations";

  export let isAtTop = true;

  let contentContainer: HTMLDivElement;

  /**
   * Handles when the content scrolls.
   */
  function onScroll() {
    const { scrollTop } = contentContainer;
    isAtTop = scrollTop === 0;
  }
</script>

<div
  class="full-screen-overlay"
  style:--background-color={!$isLandscape ? "var(--m3-scheme-background)" : "var(--m3-scheme-surface-container)"}
  transition:sharedAxisTransition|global={{ direction: "Z", leaving: false }}
>
  <div class="headline">
    <slot name="header" />
  </div>
  <div class="content" on:scroll={onScroll} bind:this={contentContainer}>
    <slot name="content" />
  </div>
</div>

<style>
  .full-screen-overlay {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;

    background-color: rgb(var(--background-color));

    z-index: 2;
  }

  .content {
    margin-top: 50px;
    height: calc(100% - 50px);
    overflow-y: scroll;
    
    scrollbar-color: transparent transparent;

    transition: scrollbar-color 0.2s ease-in-out;
  }

  .content::before {
		background: linear-gradient(
			to top,
			rgb(var(--m3-scheme-background) / 0.8),
			transparent
		);
		content: "";
		width: 100%;
		position: absolute;
		height: 40px;
		z-index: 2;
    bottom: 0;

    pointer-events: none;
	}

  .content:hover {
    scrollbar-color: rgb(var(--m3-scheme-primary)) transparent;
  }
</style>