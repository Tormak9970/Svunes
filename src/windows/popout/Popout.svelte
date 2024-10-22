<script lang="ts">
  import { DetailsArtPicture } from "@component-utils";
  import { PopoutReciever } from "@controllers";
  import { Close, DragIndicator } from "@icons";
  import { Button } from "@interactables";
  import { Marquee } from "@layout";
  import { currentSongPopout } from "@stores/Popout";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { onDestroy, onMount } from "svelte";
  import Theme from "../../components/theme/Theme.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import "../../lib/md-defs";

  let overlayControls = true;

  $: song = $currentSongPopout;
  $: label = song?.title ?? song?.fileName;
  $: artist = song?.artist;
  
  $: imagePath = convertFileSrc(song?.artPath ?? "");

  function closePopout() {
    PopoutReciever.closeWindow();
  }

  onMount(() => {
    PopoutReciever.init();
  });

  onDestroy(() => {
    PopoutReciever.destroy();
  });
</script>

<Theme>
  <div class="popout">
    <div class="header" data-tauri-drag-region>
      <div style="width: 32px; height: 32px" />
      <div style="pointer-events: none;">
        <Icon icon={DragIndicator} />
      </div>
      <Button type="text" iconType="full" size="2rem" iconSize="1.3rem" on:click={closePopout}>
        <Icon icon={Close} />
      </Button>
    </div>
    <div class="content">
      <div class="thumbnail-cont">
        <div class="thumbnail">
          <DetailsArtPicture
            artPath={imagePath}
            marginTop={false}
          />
        </div>
      </div>
      <div class="controls">

      </div>
      <div class="song-info">
        <div class="details">
          {#key label}
            <Marquee speed={40} gap={80}>
              <div class="title">{label}{artist ? "• " : ""}{artist}</div>
            </Marquee>
          {/key}
        </div>
        <!-- TODO: name -->
        <!-- TODO: favorite button -->
      </div>
    </div>
  </div>
</Theme>

<style>
  :root {
    --m3-scheme-primary: 194, 171, 171;
  }
  .popout {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: rgb(24, 24, 24);
  }

  .header {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    color: rgb(var(--m3-scheme-primary));
  }

  .content {
    width: calc(100% - 0.5rem);
    height: calc(100% - 32px - 0.5rem);
  }

  .thumbnail-cont {
    width: 100%;

    /* background-color: red; */
  }
</style>