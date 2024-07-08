<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import ListItemButton from "@layout/ListItemButton.svelte";
  import { ApiController } from "@lib/controllers/ApiController";
  import { onArtOptionsDone, showArtOptions, showSearchingApi } from "@stores/Modals";
  import { dialog } from "@tauri-apps/api";
  import { location } from "svelte-spa-router";
  import ListModalBody from "./utils/ListModalBody.svelte";

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
   * Searches the api for a picture of this artist.
   */
  async function searchWeb() {
    $showArtOptions = false;
    $showSearchingApi = true;

    let pathPromise: Promise<string | null>;
    if ($location.startsWith("/albums")) {
      const albumName = $location.substring(8).replaceAll("%20", " ");
      pathPromise = ApiController.getPictureForAlbum(albumName);
    } else {
      const songId = $location.substring(7);
      pathPromise = ApiController.getPictureForSong(songId);
    }

    await pathPromise.then((path) => {
      if (path && path !== "") {
        $onArtOptionsDone(path as string);
        $onArtOptionsDone = () => {};
      } else {
        $showArtOptions = true;
      }
    });
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

<ListModalBody open headline="Update Image" on:close={cancel}>
  <div class="list">
    <ListItemButton headline="Pick from device" on:click={pickImage} />
    {#if $location.startsWith("/albums") || $location.startsWith("/songs")}
      <ListItemButton headline="Pull from Web" on:click={searchWeb} />
    {/if}
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