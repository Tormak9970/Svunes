<script lang="ts">
  import DetailsArtPicture from "@component-utils/DetailsArtPicture.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import { EditController, LogController } from "@controllers";
  import Button from "@interactables/Button.svelte";
  import TextField from "@interactables/TextField.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import OverlayBody from "@overlays/utils/OverlayBody.svelte";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { t } from "@stores/Locale";
  import { onArtOptionsDone, showArtOptions } from "@stores/Modals";
  import { playlists, playlistsMap, showErrorSnackbar } from "@stores/State";
  import { onMount } from "svelte";
  import { pop } from "svelte-spa-router";

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
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
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