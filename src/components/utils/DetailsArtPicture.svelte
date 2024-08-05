<script lang="ts">
  import { Lazy, MusicNotePlaceholder } from "@layout";
  import { convertFileSrc } from "@tauri-apps/api/core";
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
    <Lazy height={imageSize} src="{convertedPath}" {clickable} on:click={() => dispatch("click")}>
      <span style="display: flex; width: {imageSize}px; height: {imageSize}px;">
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