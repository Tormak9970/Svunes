<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import { songViewing } from "../../../stores/Overlays";
  import { songsMap } from "../../../stores/State";
  import IconButton from "../../interactables/IconButton.svelte";
  import Lazy from "../../layout/Lazy.svelte";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import FullscreenOverlayBody from "../FullscreenOverlayBody.svelte";
  import OverlayHeader from "../OverlayHeader.svelte";
  import BackArrow from "svelte-icons/md/MdArrowBack.svelte";
    import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  
  $: song = $songsMap[$songViewing!];
  $: convertedPath = song.albumPath ? tauri.convertFileSrc(song.albumPath) : "";

  let highlight = false;

  function back() {

  }
</script>

<FullscreenOverlayBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
      <span slot="left">
        <IconButton onClick={back}>
          <BackArrow />
        </IconButton>
      </span>
    </OverlayHeader>
  </span>
  <span slot="content">
    <!-- TODO: album picture -->
    <div class="album-picture">
      <!-- <Lazy height={LIST_IMAGE_DIMENSIONS.height} fadeOption={IMAGE_FADE_OPTIONS}>
        <img src="{convertedPath}" style="width: {LIST_IMAGE_DIMENSIONS.width}px; height: {LIST_IMAGE_DIMENSIONS.height}px;" draggable="false" />
        <span slot="placeholder">
          <MusicNotePlaceholder />
        </span>
      </Lazy> -->
    </div>
    <div class="details">
      <md-list style="max-width: 300px;">
        <md-list-item>
          Details
        </md-list-item>
        <md-divider></md-divider>
        <md-list-item>
          Apple
      </md-list-item>
        <md-list-item>
          Banana
        </md-list-item>
        <md-list-item>
          <div slot="headline">Cucumber</div>
          <div slot="supporting-text">Cucumbers are long green fruits that are just as long as this multi-line description</div>
        </md-list-item>
        <md-list-item
            interactive
            href="https://google.com/search?q=buy+kiwis&tbm=shop"
            target="_blank">
          <div slot="headline">Shop for Kiwis</div>
          <div slot="supporting-text">This will link you out in a new tab</div>
          <md-icon slot="end">open_in_new</md-icon>
        </md-list-item>
      </md-list>
    </div>
  </span>
</FullscreenOverlayBody>

<style>
  .album-picture {
    width: calc(100% - 40px);
    max-width: 400px;
    height: auto;
  }

  .details {

  }
</style>