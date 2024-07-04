<script lang="ts">
  import { showMetadataParser } from "@stores/Modals";

  import Button from "@interactables/Button.svelte";
  import ModalBody from "./utils/ModalBody.svelte";

  function cancel() {
    $showMetadataParser = false;
  }
  
  function save() {
    $showMetadataParser = false;
  }

  function parse() {

  }
</script>

<ModalBody bind:open={$showMetadataParser} headline="Advanced Song Filters" on:close={() => $showMetadataParser = false }>
  <div style="height: fit-content;">
    <!-- input -->
    <!-- preview -->
  </div>
  <div class="actions" slot="buttons">
    <div class="left">
      <Button type="text" on:click={cancel}>Cancel</Button>
    </div>
    <div class="right">
      <Button type="text" on:click={parse}>Parse</Button>
      <Button type="text" on:click={save}>Save</Button>
    </div>
  </div>
</ModalBody>

<style>
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .entry {
    width: 100%;
    height: 40px;

    display: flex;
    align-items: center;
    gap: 15px;

    user-select: none;

    background-color: rgb(var(--m3-scheme-surface-container-high));

    border-radius: 4px;
	}

  .checkbox-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>