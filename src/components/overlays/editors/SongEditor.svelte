<script lang="ts">
  import { Button, Icon } from "m3-svelte";
  import { showEditSong, showSongDetails, songViewing } from "../../../stores/Overlays";
  import FullscreenOverlayBody from "../utils/FullscreenOverlayBody.svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";

  let canSave = false;

  let highlight = false;

  function back() {
    if (!$showSongDetails) {
      $songViewing = null;
    }
    $showEditSong = false;
  }

  function saveChanges() {

  }
</script>

<FullscreenOverlayBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
      <span slot="left">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
      </span>
      <span slot="right">
        <Button type="text" disabled={!canSave} on:click={saveChanges}>
          Save
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span slot="content">

  </span>
</FullscreenOverlayBody>

<style>

</style>