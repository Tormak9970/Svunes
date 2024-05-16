<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Icon } from "m3-svelte";
  import FullscreenOverlayBody from "../utils/FullscreenOverlayBody.svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { songsMap } from "../../../stores/State";
  import Lazy from "../../layout/Lazy.svelte";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import TextField from "../../interactables/TextField.svelte";
  import NumberField from "../../interactables/NumberField.svelte";
  import ErrorSnackbar, { type ErrorSnackbarIn } from "../../snackbars/error/ErrorSnackbar.svelte";
  import { tauri } from "@tauri-apps/api";
  import { showEditSong, showSongDetails, songViewing } from "../../../stores/Overlays";
  import { AppController } from "../../../lib/controllers/AppController";
  import { LogController } from "../../../lib/controllers/LogController";
  import { Song } from "../../../lib/models/Song";

  let snackbar: (data: ErrorSnackbarIn) => void;

  $: song = $songViewing ? $songsMap[$songViewing] : null;
  
  let albumPath: string | undefined;
  $: convertedPath = albumPath ? tauri.convertFileSrc(albumPath) : "";

  let title: string;
  let album: string | undefined;
  let artist: string | undefined;
  let albumArtist: string | undefined;
  let composer: string | undefined;
  let genre: string | undefined;
  let trackNumber: string | undefined;
  let releaseYear: string;

  let imageSize = 360;

  let isAtTop = true;
  
  $: canSave = (
    albumPath !== song?.artPath ||
    title !== song?.title ||
    album !== song?.album ||
    artist !== song?.artist ||
    albumArtist !== song?.albumArtist ||
    composer !== song?.composer ||
    genre !== song?.genre ||
    trackNumber !== song?.trackNumber ||
    releaseYear !== song?.releaseYear.toString()
  );

  /**
   * Initializes the song fields.
   */
  function initializeFields() {
    albumPath = song?.artPath;

    title = song!.title;
    album = song!.album;
    artist = song!.artist;
    albumArtist = song?.albumArtist;
    composer = song?.composer;
    genre = song?.genre;
    trackNumber = song?.trackNumber;
    releaseYear = song!.releaseYear.toString();
  }

  /**
   * Closes the edit overlay.
   */
  function back() {
    if (!$showSongDetails) {
      $songViewing = null;
    }
    $showEditSong = false;
  }

  /**
   * Saves the changes the user has made.
   */
  function saveChanges() {
    if (title !== "") {
      const editedSong = new Song(title, album !== "" ? album : undefined, artist !== "" ? artist : undefined, composer !== "" ? composer : undefined, albumArtist !== "" ? albumArtist : undefined, parseInt(releaseYear), song!.length, song!.bitRate, song!.sampleRate, song!.size, song!.filePath, albumPath ? albumPath : "", song!.lastPlayedOn, genre !== "" ? genre : undefined, trackNumber !== "" ? trackNumber : undefined, song!.totalTracks);
      AppController.editSong($songsMap[$songViewing!], editedSong);
      canSave = false;
      back();
    } else {
      snackbar({ message: "Title is required!", closable: true, timeout: 3000 });
      LogController.error("Failed to save changes! A title is required!");
    }
  }

  /**
   * Handles prompting the user to change the song's art.
   */
  function onAlbumArtClick() {
    // TODO: show an overlay
  }

  /**
   * Callback to run when the new album art is set.
   * @param newPath
   */
  function onAlbumArtChange(newPath: string) {

  }

  onMount(() => {
    initializeFields();
  });
</script>

<FullscreenOverlayBody bind:isAtTop={isAtTop}>
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
      <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS} clickable on:click={onAlbumArtClick}>
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{convertedPath}" style="width: auto; height: auto; max-width: {imageSize}px; max-height: {imageSize}px;" draggable="false" />
        <span slot="placeholder">
          <MusicNotePlaceholder />
        </span>
      </Lazy>
    </div>
    <div class="fields">
      <TextField name="Title" bind:value={title} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Album" bind:value={album} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Artist" bind:value={artist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Album Artist" bind:value={albumArtist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Composer" bind:value={composer} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Genre" bind:value={genre} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <div class="two-wide">
        <NumberField name="Track #" bind:value={trackNumber} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px); margin-right: 10px;" }} extraOptions={{ type: "number" }} />
        <NumberField name="Year" bind:value={releaseYear} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px);" }} extraOptions={{ type: "number" }} />
      </div>
    </div>
    <ErrorSnackbar bind:show={snackbar} />
  </span>
</FullscreenOverlayBody>

<style>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .album-picture {
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

  .two-wide {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    padding-bottom: 40px;
  }
</style>