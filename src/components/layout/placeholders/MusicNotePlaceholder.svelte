<script lang="ts">
  import MusicNote from "svelte-icons/md/MdMusicNote.svelte";

  export let width = 30;
  export let height = 30;
</script>

<div class="placeholder-background">
  <div style="width: {width}px; height: {height}px;">
    <MusicNote />
  </div>
</div>

<style>
  .placeholder-background {
    width: 100%;
    height: 100%;
    background-color: var(--md-sys-color-surface-container-low);
    color: var(--md-sys-color-on-secondary-container);

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>