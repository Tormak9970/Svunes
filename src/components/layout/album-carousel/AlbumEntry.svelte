<script lang="ts">
  import CardClickable from "@layout/CardClickable.svelte";
  import Lazy from "@layout/Lazy.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import type { Album } from "@lib/models/Album";
  import { IMAGE_FADE_OPTIONS } from "@lib/utils/ImageConstants";
  import { tauri } from "@tauri-apps/api";
  import { location, push } from "svelte-spa-router";

  export let album: Album;

  let size = 150;

  $: convertedPath = album.artPath ? tauri.convertFileSrc(album.artPath) : "";

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    if ($location.endsWith("alt")) {
      push(`/albums/${album.name}`);
    } else {
      push(`/albums/${album.name}/alt`);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" on:click={onClick} extraOptions={{ style: `width: ${size + 10}px; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 10px; margin: 0px;` }}>
  <div class="content">
    <div class="album" style="width: {size}px; height: {size}px;">
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
    <div class="bottom" style="height: {50}px;">
      <div class="info">
        {album.name}
      </div>
    </div>
  </div>
</CardClickable>

<style>
  .content {
    width: calc(100% - 10px); 
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bottom {
    padding-top: 9px;
    padding-bottom: 4px;
    width: calc(100% - 20px);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    margin-right: 0px;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .album {
    border-radius: 10px;
    overflow: hidden;
  }
</style>