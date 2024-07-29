<script lang="ts">
  import CardClickable from "@layout/CardClickable.svelte";
  import Lazy from "@layout/Lazy.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import type { Artist } from "@lib/models/Artist";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { IMAGE_FADE_OPTIONS } from "@utils";
  import { push } from "svelte-spa-router";

  export let artist: Artist;

  let size = 150;

  $: convertedPath = artist.imagePath ? convertFileSrc(artist.imagePath) : "";

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    push(`/artists/${artist.name}`);
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
      <div class="font-label info">{artist.name}</div>
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
    justify-content: center;
  }

  .info {
    margin-right: 0px;
    text-overflow: ellipsis;
    overflow: hidden;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .album {
    border-radius: 50%;
    overflow: hidden;
  }
</style>