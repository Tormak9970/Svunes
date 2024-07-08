<script lang="ts">
  import DetailsArtPicture from "@component-utils/DetailsArtPicture.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import NumberField from "@interactables/NumberField.svelte";
  import TextField from "@interactables/TextField.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import TravelExplore from "@ktibow/iconset-material-symbols/travel-explore-rounded";
  import { ApiController } from "@lib/controllers/ApiController";
  import { EditController } from "@lib/controllers/EditController";
  import { LogController } from "@lib/controllers/utils/LogController";
  import OverlayBody from "@overlays/utils/OverlayBody.svelte";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { onArtOptionsDone, showArtOptions, showSearchingApi } from "@stores/Modals";
  import { showWritingChanges } from "@stores/Overlays";
  import { showErrorSnackbar, showInfoSnackbar, songsMap } from "@stores/State";
  import { onMount } from "svelte";
  import { pop } from "svelte-spa-router";

  export let params: { id?: string } = {};
  $: song = params.id ? $songsMap[params.id] : null;

  let artPath: string | undefined;

  let title: string | undefined;
  let album: string | undefined;
  let artist: string | undefined;
  let albumArtist: string | undefined;
  let composer: string | undefined;
  let genre: string | undefined;
  let trackNumber: string | undefined;
  let releaseYear: string | undefined;

  let isAtTop = true;
  
  $: canSave = artPath !== song?.artPath ||
    title !== song?.title ||
    album !== song?.album ||
    artist !== song?.artist ||
    albumArtist !== song?.albumArtist ||
    composer !== song?.composer ||
    genre !== song?.genre ||
    trackNumber !== song?.trackNumber?.toString() ||
    releaseYear !== (song?.releaseYear === -1 ? undefined : song?.releaseYear.toString());

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
    if (title === "") {
      $showErrorSnackbar({ message: "Title is required!", faster: true });
      LogController.error("Failed to save changes! A title is required!");
      return;
    }

    const editFields: SongEditFields = {
      "artPath": artPath,
      "title": title,
      "album": album !== "" ? album : undefined,
      "composer": composer !== "" ? composer : undefined,
      "albumArtist": albumArtist !== "" ? albumArtist : undefined,
      "artist": artist !== "" ? artist : undefined,
      "releaseYear":  releaseYear && releaseYear !== "" ? parseInt(releaseYear) : undefined,
      "genre": genre !== "" ? genre : undefined,
      "trackNumber": trackNumber && trackNumber !== "" ? parseInt(trackNumber) : undefined
    }
    $showWritingChanges = true;
    EditController.editSong($songsMap[params!.id!], editFields).then(() => {
      canSave = false;
      $showWritingChanges = false;
      back();
    });
  }

  /**
   * Handles prompting the user to change the song's art.
   */
  function onAlbumArtClick() {
    if (!!album) {
      $showInfoSnackbar({ message: "Can't edit because this song is in an album" });
      return;
    }
    
    $onArtOptionsDone = async (path: string | undefined) => {
      // const copiedPath = await EditController.copyAlbumImage(path, title);
      // artPath = copiedPath;
      $showInfoSnackbar({ message: "Need to implement this" });
    }
    $showArtOptions = true;
  }
  
  /**
   * Searches the api for a picture of this artist.
   */
  async function searchWeb() {
    $showSearchingApi = true;

    await ApiController.getInfoForSong(params.id!).then((songInfo) => {
      if (songInfo) {
        if (songInfo.album) album = songInfo.album;
        if (songInfo.artist) artist = songInfo.artist;
        if (songInfo.albumArtist) albumArtist = songInfo.albumArtist;
        if (songInfo.composer) composer = songInfo.composer;
        if (songInfo.genre) genre = songInfo.genre;
        if (songInfo.trackNumber) trackNumber = songInfo.trackNumber;
        if (songInfo.releaseYear) releaseYear = songInfo.releaseYear;
        
        $showInfoSnackbar({ message: "Applied results from search" });
      }
    });
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
      <span slot="right" style="display: flex; align-items: center;">
        <Button type="text" iconType="full" on:click={searchWeb}>
          <Icon icon={TravelExplore} />
        </Button>
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
        <NumberField name="Track #" bind:value={trackNumber} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px); margin-right: 10px;" }} />
        <NumberField name="Year" bind:value={releaseYear} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px);" }} />
      </div>
    </div>
  </span>
</OverlayBody>

<style>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 70px;
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