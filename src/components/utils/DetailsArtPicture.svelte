<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { IMAGE_FADE_OPTIONS } from "../../lib/utils/ImageConstants";
  import Lazy from "../layout/Lazy.svelte";
  import MusicNotePlaceholder from "../layout/placeholders/MusicNotePlaceholder.svelte";
  import { tauri } from "@tauri-apps/api";

  export let artPath: string | undefined;
  $: convertedPath = artPath ? tauri.convertFileSrc(artPath) : "";
  
  export let imageSize = 370;
  export let clickable = false;

  const dispatch = createEventDispatcher();

</script>

<div class="album-picture" style="max-width: {imageSize}px; max-height: {imageSize}px;">
  {#key artPath ?? ""}
    <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS} {clickable} on:click={() => dispatch("click")}>
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="{convertedPath}" style="width: auto; height: auto; max-width: {imageSize}px; max-height: {imageSize}px;" draggable="false" />
      <span slot="placeholder" style="display: flex; width: {imageSize}px; height: {imageSize}px;">
        <MusicNotePlaceholder height={80} width={80} backgroundColor="--m3-scheme-surface-container-lowest" fillColor="--m3-scheme-on-secondary" />
      </span>
    </Lazy>
  {/key}
</div>

<style>
  .album-picture {
    margin-top: 2px;
    border-radius: 10px;
    overflow: hidden;
  }
</style>