<script lang="ts">
  import { songViewing } from "../../../stores/Overlays";
  import IconButton from "../../interactables/IconButton.svelte";
  import FullscreenOverlayBody from "../FullscreenOverlayBody.svelte";
  import OverlayHeader from "../OverlayHeader.svelte";
  import BackArrow from "svelte-icons/md/MdArrowBack.svelte"

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
      <span slot="right">
        <md-text-button>Save</md-text-button>
      </span>
    </OverlayHeader>
  </span>
</FullscreenOverlayBody>

<style>

</style>