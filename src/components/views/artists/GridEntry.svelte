<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Artist } from "../../../lib/models/Artist";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { GRID_IMAGE_DIMENSIONS, IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import Lazy from "../../layout/Lazy.svelte";
  import { artistGridSize } from "../../../stores/State";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import CardClickable from "../../layout/CardClickable.svelte";
  import { push } from "svelte-spa-router";

  export let artist: Artist;

  $: convertedPath = artist.imagePath ? tauri.convertFileSrc(artist.imagePath) : "";
  $: highlighted = $selected.includes(artist.name);

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    if ($inSelectMode) {
      const nameIndex = $selected.indexOf(artist.name);
      if (nameIndex !== -1) {
        $selected.splice(nameIndex, 1);
        $selected = [ ...$selected ];
      } else {
        $selected = [ ...$selected, artist.name ];
      }
    } else {
      push(`/artists/${artist.name}`);
    }
  }

  /**
   * Handles when the user selects the entry.
   */
  function select() {
    if (!$inSelectMode) {
      $selected = [ ...$selected, artist.name ];
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; align-items: center; position: relative; padding: 5px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content" class:highlight={highlighted}>
    <div class="album" style="width: {GRID_IMAGE_DIMENSIONS[$artistGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$artistGridSize].height}px;">
      {#if convertedPath !== ""}
        <Lazy height={GRID_IMAGE_DIMENSIONS[$artistGridSize].height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="{convertedPath}" style="width: {GRID_IMAGE_DIMENSIONS[$artistGridSize].width}px; height: {GRID_IMAGE_DIMENSIONS[$artistGridSize].height}px;" draggable="false" on:error={onError} />
          <span slot="placeholder">
            <MusicNotePlaceholder />
          </span>
        </Lazy>
      {:else}
        <MusicNotePlaceholder />
      {/if}
    </div>
    <div class="bottom" style="height: {GRID_IMAGE_DIMENSIONS[$artistGridSize].infoHeight}px;">
      <div class="info">{artist.name}</div>
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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    margin-right: 0px;
    max-width: 90%;
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