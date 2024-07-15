<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import ListItemButton from "@layout/ListItemButton.svelte";
  import t from "@lib/utils/i18n";
  import { onArtOptionsDone, showArtOptions } from "@stores/Modals";
  import { dialog } from "@tauri-apps/api";
  import ListModalBody from "./utils/ListModalBody.svelte";

  let open = true;

  /**
   * Prompts the user to select an image.
   */
  async function pickImage() {
    const path = await dialog.open({
      title: t("CHOOSE_IMAGE_MESSAGE"),
      directory: false,
      multiple: false,
      filters: [
        {
          "name": t("IMAGE_LOWERCASE_VALUE"),
          "extensions": [ "png", "PNG", "jpg", "JPG", "jpeg", "JPEG" ]
        }
      ]
    });

    if (path && path !== "") {
      $onArtOptionsDone(path as string);
      $onArtOptionsDone = () => {};
      open = false;
    }
  }

  /**
   * Removes the current imagePath.
   */
  function removeImage() {
    $onArtOptionsDone(undefined);
    $onArtOptionsDone = () => {};
    open = false;
  }

  /**
   * Cancels selecting the art.
   */
  function cancel() {
    $onArtOptionsDone = () => {};
    open = false;
  }
</script>

<ListModalBody headline={t("UPDATE_IMAGE_TITLE")} open={open} on:close={cancel} on:closeEnd={() => $showArtOptions = false}>
  <div class="list">
    <ListItemButton headline={t("PICK_FROM_DEVICE_MESSAGE")} on:click={pickImage} />
    <ListItemButton headline={t("REMOVE_IMAGE_MESSAGE")} on:click={removeImage} />
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={cancel}>{t("CANCEL_ACTION")}</Button>
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