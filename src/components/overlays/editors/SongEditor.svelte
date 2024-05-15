<script lang="ts">
  import { Button, Icon } from "m3-svelte";
  import { songViewing } from "../../../stores/Overlays";
  import FullscreenOverlayBody from "../FullscreenOverlayBody.svelte";
  import OverlayHeader from "../OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";

  let highlight = false;

  function back() {

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
        <md-text-button>Save</md-text-button>
      </span>
    </OverlayHeader>
  </span>
</FullscreenOverlayBody>

<style>

</style>