<script lang="ts">
  import Lazy from "@layout/Lazy.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import type { Album } from "@lib/models/Album";
  import { IMAGE_FADE_OPTIONS } from "@lib/utils/ImageConstants";
  import { tauri } from "@tauri-apps/api";

  export let album: Album;
  export let size = 146;

  $: convertedPath = album?.artPath ? tauri.convertFileSrc(album.artPath) : "";

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
    <Lazy height={size} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="{convertedPath}" style="width: {size}px; height: {size}px;" draggable="false" on:error={onError} />
      <span slot="placeholder">
        <MusicNotePlaceholder />
      </span>
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