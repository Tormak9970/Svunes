<script lang="ts">
  import { sharedAxisTransition } from "../animations/animations";

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

<div class="full-screen-overlay" transition:sharedAxisTransition={{ direction: "Z", leaving: false }}>
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

    background-color: rgb(var(--m3-scheme-background));

    z-index: 2;
  }

  .content {
    margin-top: 50px;
    height: calc(100vh - 50px);
    overflow-y: scroll;
    
    scrollbar-color: transparent transparent;

    transition: scrollbar-color 0.2s ease-in-out;
  }

  .content:hover {
    scrollbar-color: rgb(var(--m3-scheme-primary)) transparent;
  }
</style>