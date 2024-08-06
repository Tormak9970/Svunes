<script lang="ts">
  import { DetailsArtPicture, OverlayBody, OverlayHeader } from "@component-utils";
  import { EditController, LogController } from "@controllers";
  import { Button, TextField } from "@interactables";
  import { desktopSidePanel, SidePanels } from "@stores/Layout";
  import { t } from "@stores/Locale";
  import { onArtOptionsDone, showArtOptions } from "@stores/Modals";
  import { playlists, playlistsMap, showErrorSnackbar } from "@stores/State";
  import { backFromSidePanel } from "@utils";
  import { onMount } from "svelte";
  import { pop } from "svelte-spa-router";
  import SidePanelBackButton from "../../components/desktop/SidePanelBackButton.svelte";

  export let params: { id?: string } = {};
  $: playlist = params.id ? $playlistsMap[params.id] : null;
  
  let imagePath: string | undefined;
  let playlistName: string;

  let rerenderArt = true;
  
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
    if ($desktopSidePanel === SidePanels.PLAYLIST_EDIT) {
      backFromSidePanel();
      return;
    }
    
    pop();
  }

  /**
   * Saves the changes the user has made.
   */
  function saveChanges() {
    if (playlistName !== "") {
      const original = $playlistsMap[params.id!];
      original.name = playlistName;
      original.imagePath = imagePath;
      $playlists = [ ...$playlists ];
      canSave = false;
      back();
    } else {
      $showErrorSnackbar({ message: $t("NAME_REQUIRED_MESSAGE"), faster: true });
      LogController.error("Failed to save changes! A name is required!");
    }
  }

  /**
   * Handles prompting the user to change the playlist's cover.
   */
  function onImageClick() {
    $onArtOptionsDone = async (path: string | undefined) => {
      imagePath = await EditController.copyPlaylistImage(path);
      rerenderArt = !rerenderArt;
    }
    $showArtOptions = true;
  }

  onMount(() => {
    initializeFields();
  });
</script>

<OverlayBody>
  <span slot="header">
    <OverlayHeader highlight={false}>
      <span slot="left">
        <SidePanelBackButton back={back} />
      </span>
      <span slot="right">
        <Button type="text" disabled={!canSave} on:click={saveChanges}>
          {$t("SAVE_ACTION")}
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    {#key rerenderArt}
      <DetailsArtPicture artPath={imagePath} clickable on:click={onImageClick} />
    {/key}
    <div class="fields">
      <TextField name={$t("NAME_LABEL")} bind:value={playlistName} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
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