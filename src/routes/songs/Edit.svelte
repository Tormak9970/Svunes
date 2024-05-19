<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Icon } from "m3-svelte";
  import OverlayBody from "../../components/overlays/utils/OverlayBody.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { songsMap } from "../../stores/State";
  import TextField from "../../components/interactables/TextField.svelte";
  import NumberField from "../../components/interactables/NumberField.svelte";
  import ErrorSnackbar, { type ErrorSnackbarIn } from "../../components/snackbars/error/ErrorSnackbar.svelte";
  import { AppController } from "../../lib/controllers/AppController";
  import { LogController } from "../../lib/controllers/LogController";
  import { Song } from "../../lib/models/Song";
  import { onArtOptionsDone, showArtOptions } from "../../stores/Modals";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
    import { pop } from "svelte-spa-router";

  let snackbar: (data: ErrorSnackbarIn) => void;

  export let params: { key?: string } = {};
  $: song = params.key ? $songsMap[params.key] : null;
  
  let artPath: string | undefined;

  let title: string;
  let album: string | undefined;
  let artist: string | undefined;
  let albumArtist: string | undefined;
  let composer: string | undefined;
  let genre: string | undefined;
  let trackNumber: string | undefined;
  let releaseYear: string | undefined;

  let isAtTop = true;
  
  $: canSave = (
    artPath !== song?.artPath ||
    title !== song?.title ||
    album !== song?.album ||
    artist !== song?.artist ||
    albumArtist !== song?.albumArtist ||
    composer !== song?.composer ||
    genre !== song?.genre ||
    trackNumber !== song?.trackNumber?.toString() ||
    releaseYear !== (song?.releaseYear === -1 ? undefined : song?.releaseYear.toString())
  );

  /**
   * Initializes the song fields.
   */
  function initializeFields() {
    artPath = song?.artPath;

    title = song!.title;
    album = song!.album;
    artist = song!.artist;
    albumArtist = song?.albumArtist;
    composer = song?.composer;
    genre = song?.genre;
    trackNumber = song?.trackNumber?.toString();
    releaseYear = song?.releaseYear === -1 ? undefined : song?.releaseYear.toString();
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
    if (title !== "") {
      const editedSong = new Song(title, album !== "" ? album : undefined, artist !== "" ? artist : undefined, composer !== "" ? composer : undefined, albumArtist !== "" ? albumArtist : undefined, releaseYear ? parseInt(releaseYear) : -1, song!.length, song!.bitRate, song!.sampleRate, song!.size, song!.filePath, artPath ? artPath : "", song!.lastPlayedOn, genre !== "" ? genre : undefined, trackNumber ? parseInt(trackNumber) : undefined, song!.totalTracks);
      AppController.editSong($songsMap[params!.key!], editedSong);
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

  .two-wide {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    padding-bottom: 40px;
  }
</style>