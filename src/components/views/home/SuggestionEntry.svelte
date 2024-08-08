<script lang="ts">
  import { PlaybackController } from "@controllers";
  import { Lazy, MusicNotePlaceholder } from "@layout";
  import type { Album } from "@models";
  import { convertFileSrc } from "@tauri-apps/api/core";

  export let album: Album;
  export let size = 146;

  $: convertedPath = album?.artPath ? convertFileSrc(album.artPath) : "";

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    PlaybackController.playAlbum(album);
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="album" style="width: {size}px; height: {size}px;" on:click={onClick}>
  {#if convertedPath !== ""}
    <Lazy height={size} src="{convertedPath}">
      <MusicNotePlaceholder />
    </Lazy>
  {:else}
    <MusicNotePlaceholder />
  {/if}
</div>

<style>
  .album {
    border-radius: 10px;
    overflow: hidden;

    cursor: pointer;
  }
</style>