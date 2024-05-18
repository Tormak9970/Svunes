<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Icon } from "m3-svelte";
  import OverlayBody from "../utils/OverlayBody.svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { albumsMap } from "../../../stores/State";
  import TextField from "../../interactables/TextField.svelte";
  import NumberField from "../../interactables/NumberField.svelte";
  import ErrorSnackbar, { type ErrorSnackbarIn } from "../../snackbars/error/ErrorSnackbar.svelte";
  import { showAlbumDetails, showEditAlbum, albumViewing } from "../../../stores/Overlays";
  import { AppController } from "../../../lib/controllers/AppController";
  import { LogController } from "../../../lib/controllers/LogController";
  import { onArtOptionsDone, showArtOptions } from "../../../stores/Modals";
  import { Album } from "../../../lib/models/Album";
  import DetailsArtPicture from "../utils/DetailsArtPicture.svelte";

  let snackbar: (data: ErrorSnackbarIn) => void;

  $: album = $albumViewing ? $albumsMap[$albumViewing] : null;
  
  let artPath: string | undefined;

  let albumName: string;
  let albumArtist: string | undefined;
  let genre: string | undefined;
  let releaseYear: string | undefined;

  let imageSize = 360;

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
    if (!$showAlbumDetails) {
      $albumViewing = null;
    }
    $showEditAlbum = false;
  }

  /**
   * Saves the changes the user has made.
   */
  function saveChanges() {
    const artists = albumArtist?.split(", ");
    if (albumName !== "") {
      const original = $albumsMap[$albumViewing!];
      const editedAlbum = new Album(albumName, artPath, albumArtist, releaseYear ? parseInt(releaseYear) : -1, genre, original.lastPlayedOn);
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