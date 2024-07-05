<script lang="ts">

  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { songIdsToParse } from "@stores/State";
  import { pop } from "svelte-spa-router";
  
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import CheckCircle from "@ktibow/iconset-material-symbols/check-circle-rounded";
// import Help from "@ktibow/iconset-material-symbols/help-rounded";
  import TextRotationNone from "@ktibow/iconset-material-symbols/text-rotation-none-rounded";
  // import { showParserVariables } from "@stores/Modals";
  import TextField from "@interactables/TextField.svelte";

  let isAtTop = true;
  let canSave = false;

  function cancel() {
    pop();
    $songIdsToParse = [];
  }
  
  function save() {
    // TODO: save changes

    pop();
    $songIdsToParse = [];
  }

  function parse() {

  }
</script>

<DetailsBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={cancel}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">Metadata Parser</div>
      </span>
      <span slot="right" style="display: flex; flex-direction: row; gap: 5px">
        <Button type="text" iconType="full" on:click={parse}>
          <Icon icon={TextRotationNone} width="20px" height="20px" />
        </Button>
        <Button type="text" iconType="full" disabled={!canSave} on:click={save}>
          <Icon icon={CheckCircle} width="20px" height="20px" />
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <div class="pattern-container">
      <TextField name="Pattern" />
      <!-- <Button type="text" iconType="full" on:click={() => $showParserVariables = true }>
        <Icon icon={Help} width="20px" height="20px" />
      </Button> -->
    </div>
    <div class="preview">

    </div>
  </span>
</DetailsBody>

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 70px;
  }
  
  /* .message-container {
    margin-top: 40%;
    color: rgb(var(--m3-scheme-on-secondary));
    display: flex;
    flex-direction: column;
    align-items: center;
  } */
</style>