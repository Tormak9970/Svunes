<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Artist } from "../../../lib/models/Artist";
  import { inSelectMode, selected } from "../../../stores/Select";
  import { IMAGE_FADE_OPTIONS, LIST_IMAGE_DIMENSIONS } from "../../../lib/utils/ImageConstants";
  import Lazy from "../../layout/Lazy.svelte";
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
<CardClickable type="transparent" highlight={highlighted} on:click={onClick} on:hold={select} extraOptions={{ style: "width: 100%; display: flex; position: relative; padding: 10px 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="left">
      <div class="album">
        {#if convertedPath !== ""}
          <Lazy height={LIST_IMAGE_DIMENSIONS.height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="{convertedPath}" style="width: {LIST_IMAGE_DIMENSIONS.width}px; height: {LIST_IMAGE_DIMENSIONS.height}px;" draggable="false" on:error={onError} />
            <span slot="placeholder">
              <MusicNotePlaceholder />
            </span>
          </Lazy>
        {:else}
          <MusicNotePlaceholder />
        {/if}
      </div>
      <div class="info">{artist.name}</div>
    </div>
  </div>
</CardClickable>

<style>
  .content {
    width: 100%; 
    display: flex;
    align-items: center;
  }

  .left {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .info {
    max-width: calc(100% - 75px);
  }

  .album {
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    width: 40px;

    margin-left: 10px;
    margin-right: 15px;
  }
</style>