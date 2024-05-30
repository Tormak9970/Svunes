<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../../components/interactables/Button.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import OverlayBody from "../../components/overlays/utils/OverlayBody.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { playlists, playlistsMap, showErrorSnackbar } from "../../stores/State";
  import TextField from "../../components/interactables/TextField.svelte";
  import { LogController } from "../../lib/controllers/LogController";
  import { onArtOptionsDone, showArtOptions } from "../../stores/Modals";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
  import { pop } from "svelte-spa-router";

  export let params: { key?: string } = {};
  $: playlist = params.key ? $playlistsMap[params.key] : null;
  
  let imagePath: string | undefined;
  let playlistName: string;

  let isAtTop = true;
  
  $: canSave = (
    imagePath !== playlist?.imagePath ||
    playlistName !== playlist?.name
  );

  /**
   * Initializes the playlist fields.
   */
  function initializeFields() {
    imagePath = playlist?.imagePath;

    playlistName = playlist!.name;
  }

  /**
   * Closes the edit overlay.
   */
  function back() {
    pop();
  }

  /**
   * Saves the changes the user has made.
   */
  function saveChanges() {
    if (playlistName !== "") {
      const original = $playlistsMap[params.key!];
      original.name = playlistName;
      original.imagePath = imagePath;
      $playlists = [ ...$playlists ];
      canSave = false;
      back();
    } else {
      $showErrorSnackbar({ message: "Name is required!", closable: true, timeout: 3000 });
      LogController.error("Failed to save changes! A name is required!");
    }
  }

  /**
   * Handles prompting the user to change the playlist's cover.
   */
  function onImageClick() {
    $onArtOptionsDone = (path: string | undefined) => {
      imagePath = path;
    }
    $showArtOptions = true;
  }

  onMount(() => {
    initializeFields();
  });
</script>

<OverlayBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
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
  <span class="content" slot="content">
    <DetailsArtPicture artPath={imagePath} clickable on:click={onImageClick} />
    <div class="fields">
      <TextField name="Name" bind:value={playlistName} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
    </div>
  </span>
</OverlayBody>

<style>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .fields {
    margin-top: 20px;
    width: 100%;
    max-width: 370px;
  }
</style>