<script lang="ts">
  import { Button, Icon } from "m3-svelte";
  import { showEditSong, showSongDetails, songViewing } from "../../../stores/Overlays";
  import FullscreenOverlayBody from "../utils/FullscreenOverlayBody.svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { songsMap } from "../../../stores/State";
  import { tauri } from "@tauri-apps/api";
  import Lazy from "../../layout/Lazy.svelte";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import TextField from "../../interactables/TextField.svelte";
  import NumberField from "../../interactables/NumberField.svelte";

  $: song = $songViewing ? $songsMap[$songViewing] : null;

  
  $: albumPath = song?.albumPath;
  $: convertedPath = albumPath ? tauri.convertFileSrc(albumPath) : "";

  $: title = song?.title;
  $: album = song?.album;
  $: artist = song?.artist;
  $: albumArtist = song?.albumArtist;
  $: composer = song?.composer;
  $: genre = song?.genre;
  $: releaseYear = song?.releaseYear;

  let imageSize = 360;

  let isAtTop = true;
  
  let canSave = false;

  /**
   * Closes the edit overlay.
   */
  function back() {
    if (!$showSongDetails) {
      $songViewing = null;
    }
    $showEditSong = false;
  }

  function saveChanges() {

  }

  function onAlbumArtClick() {
    // TODO: show an overlay
  }

  function onAlbumArtChange(e: Event) {

  }

  function onTitleChange(e: Event) {

  }

  function onAlbumChange(e: Event) {

  }

  function onArtistChange(e: Event) {

  }

  function onAlbumArtistChange(e: Event) {

  }

  function onComposerChange(e: Event) {

  }

  function onGenreChange(e: Event) {

  }

  function onReleaseYearChange(e: Event) {

  }
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
      <TextField name="Title" value={title} on:change={onTitleChange} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Album" value={album} on:change={onAlbumChange} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Artist" value={artist} on:change={onArtistChange} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Album Artist" value={albumArtist} on:change={onAlbumArtistChange} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <TextField name="Composer" value={composer} on:change={onComposerChange} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
      <div class="two-wide">
        <TextField name="Genre" value={genre} on:change={onGenreChange} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px); margin-right: 10px;" }} />
        <NumberField name="Year" value={releaseYear?.toString()} on:change={onReleaseYearChange} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px);" }} extraOptions={{ type: "number" }} />
      </div>
    </div>
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