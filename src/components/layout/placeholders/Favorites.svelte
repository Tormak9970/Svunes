<script lang="ts">
  import { Icon } from "@component-utils";
  import { FavoriteOn } from "@icons";

  export let width = 30;
  export let height = 30;
</script>

<div class="background">
  <div style="width: {width}px; height: {height}px;">
    <Icon icon={FavoriteOn} width={`${width}px`} height={`${height}px`} />
  </div>
</div>

<style>
  .background {
    width: 100%;
    height: 100%;
    background: rgb(var(--m3-scheme-on-primary));
    background: radial-gradient(at left top, rgb(var(--m3-scheme-on-primary)), rgb(var(--m3-scheme-on-tertiary)));
    color: rgb(var(--m3-scheme-tertiary));

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>