<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../../components/interactables/Button.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import OverlayBody from "../../components/overlays/utils/OverlayBody.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { albumsMap, showErrorSnackbar } from "../../stores/State";
  import TextField from "../../components/interactables/TextField.svelte";
  import NumberField from "../../components/interactables/NumberField.svelte";
  import { LogController } from "../../lib/controllers/utils/LogController";
  import { onArtOptionsDone, showArtOptions } from "../../stores/Modals";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
  import { pop, replace } from "svelte-spa-router";
  import { EditController } from "../../lib/controllers/EditController";

  export let params: { key?: string } = {};
  $: album = params.key ? $albumsMap[params.key] : null;
  
  let artPath: string | undefined;

  let albumName: string;
  let albumArtist: string | undefined;
  let genre: string | undefined;
  let releaseYear: string | undefined;

  let isAtTop = true;
  let albumNameChanged = false;
  
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
    if (albumNameChanged) {
      replace(`/albums/${albumName}`);
    }
  }

  /**
   * Saves the changes the user has made.
   */
  function saveChanges() {
    if (albumName !== "") {
      const editFields: AlbumEditFields = {
        "artPath": artPath,
        "name": albumName,
        "artist": albumArtist,
        "releaseYear": releaseYear ? parseInt(releaseYear) : undefined,
        "genre": genre
      }
      albumNameChanged = albumName !== album?.name;
      EditController.editAlbum($albumsMap[params.key!], editFields);
      canSave = false;
      back();
    } else {
      $showErrorSnackbar({ message: "Album is required!", timeout: 2000 });
      LogController.error("Failed to save changes! A album is required!");
    }
  }

  /**
   * Handles prompting the user to change the album's art.
   */
  function onAlbumArtClick() {
    if (albumName !== "") {
      $onArtOptionsDone = async (path: string | undefined) => {
        artPath = path;
      }
      $showArtOptions = true;
    } else {
      $showErrorSnackbar({ message: "Album name is required!" });
    }
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