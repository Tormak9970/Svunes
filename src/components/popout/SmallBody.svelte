<script lang="ts">
  import { DetailsArtPicture } from "@component-utils";
  import { currentSongPopout } from "@stores/Popout";
  
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import SmallControls from "./SmallControls.svelte";

  $: song = $currentSongPopout;
  $: label = song?.title ?? song?.fileName;
  $: artist = song?.artist;
  
  $: imagePath = song?.artPath;

  let containerHeight: number;
  let containerWidth: number;

  $: imageSize = containerHeight ? containerHeight : 370;

  // ! width percentage in relation to 445
  $: controlsMaxWidth = containerWidth ? 57 * 445 / containerWidth : undefined;
  
  $: infoMinWidth = containerWidth ? 59 * 212 / containerWidth : undefined;
</script>

<div class="details-cont" bind:clientHeight={containerHeight} bind:clientWidth={containerWidth}>
  <Splitpanes dblClickSplitter={false}>
    <Pane minSize={infoMinWidth}>
      <div class="pane">
        <div class="thumbnail">
          <DetailsArtPicture
            artPath={imagePath}
            borderRadius="4px"
            imageSize={imageSize}
            marginTop={false}
          />
        </div>
        <div class="metadata">
          <div class="title">{label}</div>
          <div class="font-body-medium artist">{artist}</div>
        </div>
      </div>
    </Pane>

    <Pane class="controls-pane" maxSize={controlsMaxWidth}>
      <div class="pane">
        <SmallControls />
      </div>
    </Pane>
  </Splitpanes>
</div>

<style>
  .details-cont {
    width: 100%;

    height: 100%;

    display: flex;
    align-items: center;
  }

  .thumbnail {
    aspect-ratio: 1 / 1;

    height: 100%;
    width: fit-content;
  }

  .pane {
    height: 100%;
    
    display: flex;
    align-items: center;
  }

  .metadata {
    margin-left: 0.5rem;
    max-width: calc(100% - 40px - 2rem);
    text-wrap: nowrap;
  }

  .artist {
    opacity: 0.7;
  }

  .details-cont :global(.controls-pane) {
    min-width: 88px;
  }
</style>