<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import Lazy from "../../layout/Lazy.svelte";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
    import { playlistGridSize } from "../../../stores/State";

  export let images: (string | undefined)[];
  export let imageSize: number;
  export let placeholderIconSize: number;

  let imagesToRender: (string | undefined)[] = [];

  $: if (images.length === 3) {
    imagesToRender = [
      images[0], images[1], images[2],
      images[2], images[0], images[1],
      images[1], images[2], images[0]
    ];
  } else if (images.length === 6) {
    imagesToRender = [
      images[0], images[1], images[2],
      images[3], images[4], images[5],
      images[1], images[2], images[3]
    ];
  } else {
    for (let i = 0; i < 9; i++) {
      imagesToRender.push(images[i % images.length]);
    }
  }

  $: converted = imagesToRender.map((image) => image ? tauri.convertFileSrc(image) : image);
</script>

<div class="grid-container">
  {#key $playlistGridSize}
    {#each converted as image}
      <div class="image-container" style="width: {imageSize}px; height: {imageSize}px;">
        <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="{image}" style="width: {imageSize}px; height: {imageSize}px;" draggable="false" on:error={onError} />
          <span slot="placeholder">
            <MusicNotePlaceholder width={placeholderIconSize} height={placeholderIconSize} />
          </span>
        </Lazy>
      </div>
    {/each}
  {/key}
</div>

<style>
  .grid-container {
    height: fit-content;
    width: fit-content;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;

    background-color: rgb(var(--m3-scheme-surface-container-high));

    transform: rotate(10deg);
    translate: -28px -28px;
  }

  .image-container {
    border-radius: 4px;
    overflow: hidden;
  }
</style>