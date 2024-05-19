<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Icon } from "m3-svelte";
  import OverlayBody from "../../components/overlays/utils/OverlayBody.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { albumsMap } from "../../stores/State";
  import TextField from "../../components/interactables/TextField.svelte";
  import NumberField from "../../components/interactables/NumberField.svelte";
  import ErrorSnackbar, { type ErrorSnackbarIn } from "../../components/snackbars/error/ErrorSnackbar.svelte";
  import { AppController } from "../../lib/controllers/AppController";
  import { LogController } from "../../lib/controllers/LogController";
  import { onArtOptionsDone, showArtOptions } from "../../stores/Modals";
  import { Album } from "../../lib/models/Album";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
    import { pop } from "svelte-spa-router";

  let snackbar: (data: ErrorSnackbarIn) => void;

  export let params: { key?: string } = {};
  $: album = params.key ? $albumsMap[params.key] : null;
  
  let artPath: string | undefined;

  let albumName: string;
  let albumArtist: string | undefined;
  let genre: string | undefined;
  let releaseYear: string | undefined;

  let isAtTop = true;
  
  $: canSave = (
    artPath !== album?.artPath ||
    albumName !== album?.name ||
    albumArtist !== album?.albumArtist ||
    genre !== album?.genre ||
    releaseYear !== (album?.releaseYear === -1 ? undefined : album?.releaseYear.toString())
  );

  /**
   * Initializes the album fields.
   */
  function initializeFields() {
    artPath = album?.artPath;

    albumName = album!.name;
    albumArtist = album?.albumArtist;
    genre = album?.genre;
    releaseYear = album?.releaseYear === -1 ? undefined : album?.releaseYear.toString();
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
    if (albumName !== "") {
      const original = $albumsMap[params.key!];
      const editedAlbum = new Album(albumName, artPath, albumArtist, releaseYear ? parseInt(releaseYear) : -1, genre, original.lastPlayedOn, original.numTimesPlayed);
      editedAlbum.songKeys = original.songKeys;
      AppController.editAlbum(original, editedAlbum);
      canSave = false;
      back();
    } else {
      snackbar({ message: "Album is required!", closable: true, timeout: 3000 });
      LogController.error("Failed to save changes! A album is required!");
    }
  }

  /**
   * Handles prompting the user to change the album's art.
   */
  function onAlbumArtClick() {
    $onArtOptionsDone = (path: string | undefined) => {
      artPath = path;
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
    <DetailsArtPicture artPath={artPath} clickable on:click={onAlbumArtClick} />
    <div class="fields">
      <TextField name="Title" bind:value={albumName} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Album Artist" bind:value={albumArtist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Genre" bind:value={genre} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <NumberField name="Year" bind:value={releaseYear} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} extraOptions={{ type: "number" }} />
    </div>
    <ErrorSnackbar bind:show={snackbar} />
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