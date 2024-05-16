<script lang="ts">
  import { dialog } from "@tauri-apps/api";
  import { onArtOptionsDone, showArtOptions } from "../../stores/Modals";
  import { Button, ListItemButton } from "m3-svelte";
  import ListModalBody from "./utils/ListModalBody.svelte";

  /**
   * Prompts the user to select an image.
   */
  async function pickImage() {
    const path = await dialog.open({
      title: "Choose a Folder",
      directory: false,
      multiple: false,
    });

    if (path && path !== "") {
      $onArtOptionsDone(path as string);
      $onArtOptionsDone = () => {};
      $showArtOptions = false;
    }
  }

  /**
   * Removes the current imagePath.
   */
  function removeImage() {
    $onArtOptionsDone(undefined);
    $onArtOptionsDone = () => {};
    $showArtOptions = false;
  }

  /**
   * Cancels selecting the art.
   */
  function cancel() {
    $onArtOptionsDone = () => {};
    $showArtOptions = false;
  }
</script>

<ListModalBody open={$showArtOptions} headline={"Update Image"}>
  <div class="list">
    <ListItemButton headline="Pick from device" on:click={pickImage} />
    <ListItemButton headline="Remove image" on:click={removeImage} />
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={cancel}>Cancel</Button>
    </div>
  </div>
</ListModalBody>

<style>
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>