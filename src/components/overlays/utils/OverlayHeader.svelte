<script lang="ts">
  export let highlight: boolean;
  export let highlightColor = "--m3-scheme-surface-container";
</script>

<div class="overlay-header" class:highlight style="--highlight-color: rgb(var({highlightColor}));">
  <div class="left">
    <slot name="left" />
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style>
  .overlay-header {
    padding: 5px 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    transition: background-color 0.2s ease-in-out;

    position: absolute;
    top: 0;

    z-index: 2;
  }

  .highlight {
    background-color: var(--highlight-color);
  }

  .left {
    height: 100%;
    margin-left: 10px;
  }

  .right {
    height: 100%;
    margin-right: 10px;
  }
</style>