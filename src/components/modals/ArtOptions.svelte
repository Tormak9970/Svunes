<script lang="ts">
  import { dialog } from "@tauri-apps/api";
  import { onArtOptionsDone, showArtOptions } from "../../stores/Modals";
  import Button from "../interactables/Button.svelte";
  import ListModalBody from "./utils/ListModalBody.svelte";
  import ListItemButton from "../layout/ListItemButton.svelte";

  /**
   * Prompts the user to select an image.
   */
  async function pickImage() {
    const path = await dialog.open({
      title: "Choose an Image",
      directory: false,
      multiple: false,
      filters: [
        {
          "name": "image",
          "extensions": [ "png", "PNG", "jpg", "JPG", "jpeg", "JPEG" ]
        }
      ]
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

<ListModalBody open={$showArtOptions} headline={"Update Image"} on:closedByClick={cancel} on:closedByEsc={cancel}>
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