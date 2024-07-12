<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { showParserVariables } from "@stores/Modals";
  import ModalBody from "./utils/ModalBody.svelte";

  let open = true;
</script>

<ModalBody headline="Parser Variables" open={open} on:close={() => open = false} on:closeEnd={() => $showParserVariables = false }>
  <div class="content">
    <div>You can only use a variable once.<br/>%dummy% can be used many times.</div>
    <div><b>%title%</b> - The track's title</div>
    <div><b>%album%</b> - The track's album</div>
    <div><b>%track%</b> - The track number</div>
    <div><b>%artist%</b> - The track's artist</div>
    <div><b>%albumartist%</b> - The track's album artist</div>
    <div><b>%genre%</b> - The track's genre</div>
    <div><b>%year%</b> - The track's release year</div>
    <div><b>%dummy%</b> - A placeholder variable</div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={() => open = false }>Close</Button>
    </div>
  </div>
</ModalBody>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    font-size: 16px;
  }
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>