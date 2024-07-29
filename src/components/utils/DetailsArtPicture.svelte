<script lang="ts">
  import Lazy from "@layout/Lazy.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { IMAGE_FADE_OPTIONS } from "@utils";
  import { createEventDispatcher } from "svelte";

  export let artPath: string | undefined;
  export let failValue = "";
  export let borderRadius = "10px";
  $: convertedPath = artPath && artPath !== failValue ? convertFileSrc(artPath) : "";
  
  export let imageSize = 370;
  export let clickable = false;
  export let marginTop = true;

  const dispatch = createEventDispatcher();

</script>

<div class="album-picture" style:--border-radius={borderRadius} style:margin-top={marginTop ? "2px" : "0"} style="max-width: {imageSize}px; max-height: {imageSize}px;">
  {#key artPath ?? ""}
    <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS} {clickable} on:click={() => dispatch("click")} let:onError>
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="{convertedPath}" style="width: auto; height: auto; max-width: {imageSize}px; max-height: {imageSize}px;" draggable="false" on:error={onError} />
      <span slot="placeholder" style="display: flex; width: {imageSize}px; height: {imageSize}px;">
        <MusicNotePlaceholder height={80} width={80} backgroundColor="--m3-scheme-surface-container-lowest" fillColor="--m3-scheme-on-secondary" />
      </span>
    </Lazy>
  {/key}
</div>

<style>
  .album-picture {
    border-radius: var(--border-radius);
    width: 100%;
    overflow: hidden;
  }
</style>