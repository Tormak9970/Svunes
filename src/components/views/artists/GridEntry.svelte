<script lang="ts">
  import CardClickable from "@layout/CardClickable.svelte";
  import type { Artist } from "@lib/models/Artist";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { inSelectMode, selected } from "@stores/Select";
  import { artistGridSize } from "@stores/State";
  import { tauri } from "@tauri-apps/api";
  import { push } from "svelte-spa-router";
  import { GridSize } from "../../../types/Settings";
  import ViewImage from "../../utils/ViewImage.svelte";

  export let artist: Artist;

  $: convertedPath = artist.imagePath ? tauri.convertFileSrc(artist.imagePath) : "";
  $: highlighted = $selected.includes(artist.name);
  $: size = $artistGridSize === GridSize.MEDIUM ? 40 : 60;

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
    <ViewImage src={convertedPath} width={GRID_IMAGE_DIMENSIONS[$artistGridSize].width} height={GRID_IMAGE_DIMENSIONS[$artistGridSize].height} iconSize={size} borderRadius="50%" />
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
</style>