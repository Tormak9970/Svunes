<script lang="ts">
  export let title: string;
  export let highlight: boolean;
</script>

<div class="view-header" class:highlight>
  <div class="left">
    <slot name="left" />
  </div>
  <div class="title">
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
    background-color: var(--md-sys-color-surface-container);
  }

  .title {
    font-size: 20px;
  }

  .left {
    height: 100%;
    margin-left: 5px;
  }

  .right {
    height: 100%;
    margin-right: 5px;
  }
</style>