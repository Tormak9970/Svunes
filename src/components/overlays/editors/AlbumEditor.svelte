<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Icon } from "m3-svelte";
  import OverlayBody from "../utils/OverlayBody.svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { albumsMap } from "../../../stores/State";
  import Lazy from "../../layout/Lazy.svelte";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import TextField from "../../interactables/TextField.svelte";
  import NumberField from "../../interactables/NumberField.svelte";
  import ErrorSnackbar, { type ErrorSnackbarIn } from "../../snackbars/error/ErrorSnackbar.svelte";
  import { tauri } from "@tauri-apps/api";
  import { showAlbumDetails, showEditAlbum, albumViewing } from "../../../stores/Overlays";
  import { AppController } from "../../../lib/controllers/AppController";
  import { LogController } from "../../../lib/controllers/LogController";
  import { onArtOptionsDone, showArtOptions } from "../../../stores/Modals";
  import { Album } from "../../../lib/models/Album";

  let snackbar: (data: ErrorSnackbarIn) => void;

  $: album = $albumViewing ? $albumsMap[$albumViewing] : null;
  
  let artPath: string | undefined;
  $: convertedPath = artPath ? tauri.convertFileSrc(artPath) : "";

  let albumName: string;
  let albumArtist: string | undefined;
  let genre: string | undefined;
  let releaseYear: string | undefined;

  let imageSize = 360;

  let isAtTop = true;
  
  $: canSave = (
    artPath !== album?.artPath ||
    albumName !== album?.name ||
    albumArtist !== album?.displayArtists() ||
    genre !== album?.genre ||
    releaseYear !== (album?.releaseYear === -1 ? undefined : album?.releaseYear.toString())
  );

  /**
   * Initializes the album fields.
   */
  function initializeFields() {
    artPath = album?.artPath;

    albumName = album!.name;
    albumArtist = album?.displayArtists();
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
      const editedAlbum = new Album(albumName, artPath, releaseYear ? parseInt(releaseYear) : -1, genre, original.lastPlayedOn);
      editedAlbum.artists = new Set(artists);
      editedAlbum.songNames = original.songNames;
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
    <div class="album-picture">
      {#key artPath ?? ""}
        <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS} clickable on:click={onAlbumArtClick}>
          <!-- svelte-ignore missing-declaration -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="{convertedPath}" style="width: auto; height: auto; max-width: {imageSize}px; max-height: {imageSize}px;" draggable="false" />
          <span slot="placeholder">
            <MusicNotePlaceholder height={80} width={80} backgroundColor="--m3-scheme-surface-container-lowest" fillColor="--m3-scheme-on-secondary" />
          </span>
        </Lazy>
      {/key}
    </div>
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

  .album-picture {
    margin-top: 2px;
    width: calc(100% - 20px);
    max-width: 360px;
    max-height: 360px;
    border-radius: 10px;
    overflow: hidden;
  }

  .fields {
    margin-top: 20px;
    width: calc(100% - 20px);
  }
</style>