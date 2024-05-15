<script lang="ts">
  export let scrollTop:number = 0;

  let container: HTMLDivElement;

  /**
   * Handles updating scroll-top when the user scrolls.
   */
  function onScroll() {
    scrollTop = container.scrollTop;
  }
</script>

<div class="scrcollable-container" on:scroll={onScroll} bind:this={container}>
  <slot />
</div>

<style>
  .scrcollable-container {
    width: 100%;
    height: 100%;

    overflow-y: scroll;
    overflow-x: hidden;
  }

  /* .scroller { margin-right: 3px; } */
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--md-sys-color-primary); border-radius: 4px; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
</style>