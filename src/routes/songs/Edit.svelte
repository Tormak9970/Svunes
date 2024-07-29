<script lang="ts">
  import { DetailsArtPicture, Icon, OverlayBody, OverlayHeader } from "@component-utils";
  import { EditController, LogController } from "@controllers";
  import { isScrolled } from "@directives";
  import { Button, NumberField, TextField } from "@interactables";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { t } from "@stores/Locale";
  import { showWritingChanges } from "@stores/Overlays";
  import { showErrorSnackbar, songsMap } from "@stores/State";
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

  let highlight = false;
  
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
      $showErrorSnackbar({ message: $t("SONG_TITLE_REQUIRED_MESSAGE"), faster: true });
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

  onMount(() => {
    initializeFields();
  });
</script>

<OverlayBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
      <span slot="left">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
      </span>
      <span slot="right" style="display: flex; align-items: center;">
        <Button type="text" disabled={!canSave} on:click={saveChanges}>
          {$t("SAVE_ACTION")}
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span class="content styled-scrollbar" slot="content" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
    <div class="content-inner">
      <DetailsArtPicture artPath={artPath} />
      <div class="fields">
        <TextField name={$t("TITLE_LABEL")} bind:value={title} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("ALBUM_LABEL")} bind:value={album} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("ARTIST_LABEL")} bind:value={artist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("ALBUM_ARTIST_LABEL")} bind:value={albumArtist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("COMPOSER_LABEL")} bind:value={composer} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("GENRE_LABEL")} bind:value={genre} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <div class="two-wide">
          <NumberField name="{$t("TRACK_LABEL")} #" bind:value={trackNumber} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px); margin-right: 10px;" }} />
          <NumberField name={$t("YEAR_LABEL")} bind:value={releaseYear} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px);" }} />
        </div>
      </div>
      <div style="width: 100%; height: 70px;" />
    </div>
  </span>
</OverlayBody>

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
    overflow-x: hidden;
  }

  .content-inner {
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