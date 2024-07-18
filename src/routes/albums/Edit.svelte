<script lang="ts">
  import DetailsArtPicture from "@component-utils/DetailsArtPicture.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import NumberField from "@interactables/NumberField.svelte";
  import TextField from "@interactables/TextField.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import PageViewOutlined from "@ktibow/iconset-material-symbols/pageview-outline-rounded";
  import TravelExplore from "@ktibow/iconset-material-symbols/travel-explore-rounded";
  import { ApiController } from "@lib/controllers/ApiController";
  import { AppController } from "@lib/controllers/AppController";
  import { EditController } from "@lib/controllers/EditController";
  import { LogController } from "@lib/controllers/utils/LogController";
  import OverlayBody from "@overlays/utils/OverlayBody.svelte";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { t } from "@stores/Locale";
  import { onArtOptionsDone, showArtOptions, showSearchingApi } from "@stores/Modals";
  import { showWritingChanges } from "@stores/Overlays";
  import { albumsMap, showErrorSnackbar, showInfoSnackbar } from "@stores/State";
  import { onMount } from "svelte";
  import { pop, replace } from "svelte-spa-router";

  export let params: { key?: string } = {};
  $: album = params.key ? $albumsMap[params.key] : null;
  
  let artPath: string | undefined;

  let albumName: string;
  let albumArtist: string | undefined;
  let genre: string | undefined;
  let releaseYear: string | undefined;

  let isAtTop = true;
  let albumNameChanged = false;
  
  $: canSave = artPath !== album?.artPath ||
    albumName !== album?.name ||
    albumArtist !== album?.albumArtist ||
    genre !== album?.genre ||
    releaseYear !== (album?.releaseYear === -1 ? undefined : album?.releaseYear.toString());

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
    if (albumNameChanged) {
      replace(`/albums/${albumName}`);
    } else {
      pop();
    }
  }

  /**
   * Saves the changes the user has made.
   */
  function saveChanges() {
    if (albumName === "") {
      $showErrorSnackbar({ message: $t("ALBUM_NAME_REQUIRED_MESSAGE"), faster: true });
      LogController.error("Failed to save changes! A album is required!");
      return;
    }

    const editFields: AlbumEditFields = {
      "artPath": artPath,
      "name": albumName,
      "albumArtist": albumArtist,
      "releaseYear": releaseYear ? parseInt(releaseYear) : undefined,
      "genre": genre
    }
    albumNameChanged = albumName !== album?.name;
    $showWritingChanges = true;
    EditController.editAlbum($albumsMap[params.key!], editFields).then(() => {
      canSave = false;
      $showWritingChanges = false;
      back();
    });
  }

  /**
   * Handles prompting the user to change the album's art.
   */
  function onAlbumArtClick() {
    if (albumName === "") {
      $showErrorSnackbar({ message: $t("ALBUM_NAME_REQUIRED_MESSAGE") });
      return;
    }

    $onArtOptionsDone = async (path: string | undefined) => {
      artPath = path;
    }
    $showArtOptions = true;
  }
  
  /**
   * Searches the api for album covers.
   */
  async function searchImage() {
    if (!AppController.isOnline()) {
      $showErrorSnackbar({ message: $t("COVER_SEARCH_REQUIRES_INTERNET_MESSAGE") });
      return;
    }

    if (!albumName) {
      $showErrorSnackbar({ message: $t("ALBUM_NAME_REQUIRED_MESSAGE") });
      return;
    }

    $showSearchingApi = true;

    await ApiController.getPictureForAlbum(albumName).then((path) => {
      if (path && path !== "") artPath = path;
    });
  }
  
  /**
   * Searches the api for a picture of this artist.
   */
  async function searchWeb() {
    if (!AppController.isOnline()) {
      $showErrorSnackbar({ message: $t("INFO_SEARCH_REQUIRES_INTERNET_MESSAGE") });
      return;
    }

    if (!albumName) {
      $showErrorSnackbar({ message: $t("ALBUM_NAME_REQUIRED_MESSAGE") });
      return;
    }

    $showSearchingApi = true;

    await ApiController.getInfoForAlbum(albumName).then((albumInfo) => {
      if (albumInfo) {
        if (albumInfo.artist) albumArtist = albumInfo.artist;
        if (albumInfo.genre) genre = albumInfo.genre;
        if (albumInfo.releaseYear) releaseYear = albumInfo.releaseYear;
        
        $showInfoSnackbar({ message: $t("APPLIED_SEARCH_RESULTS_MESSAGE") });
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
        <Button type="text" iconType="full" on:click={searchImage}>
          <Icon icon={PageViewOutlined} />
        </Button>
        <Button type="text" iconType="full" on:click={searchWeb}>
          <Icon icon={TravelExplore} />
        </Button>
        <Button type="text" disabled={!canSave} on:click={saveChanges}>
          {$t("SAVE_ACTION")}
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <DetailsArtPicture artPath={artPath} clickable on:click={onAlbumArtClick} />
    <div class="fields">
      <TextField name={$t("NAME_LABEL")} bind:value={albumName} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name={$t("ARTIST_LABEL")} bind:value={albumArtist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name={$t("GENRE_LABEL")} bind:value={genre} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <NumberField name={$t("YEAR_LABEL")} bind:value={releaseYear} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} extraOptions={{ type: "number" }} />
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
</style>