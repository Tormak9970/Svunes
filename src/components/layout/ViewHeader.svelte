<script lang="ts">
  export let title: string;
  export let highlight: boolean;
  export let highlightColor = "--m3-scheme-surface-container";
</script>

<div class="view-header" class:highlight style="--highlight-color: rgb(var({highlightColor}));">
  <div class="left">
    <slot name="left" />
  </div>
  <div class="font-headline">
    {title}
  </div>
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style>
  .view-header {
    padding: 5px 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.2s ease-in-out;
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