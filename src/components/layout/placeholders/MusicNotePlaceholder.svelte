<script lang="ts">
  import { Icon } from "@component-utils";
  import { MusicNote } from "@icons";

  export let width = 30;
  export let height = 30;
  export let backgroundColor = "--m3-scheme-surface-container-low";
  export let fillColor = "--m3-scheme-secondary-container";
</script>

<div class="placeholder-background" style="--background-color: var({backgroundColor}); --fill-color: var({fillColor});">
  <div style="width: {width}px; height: {height}px;">
    <Icon icon={MusicNote} width={`${width}px`} height={`${height}px`} />
  </div>
</div>

<style>
  .placeholder-background {
    width: 100%;
    height: 100%;
    background-color: rgb(var(--background-color));
    color: rgb(var(--fill-color));

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>