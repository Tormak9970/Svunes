<script lang="ts">
  import { DetailsArtPicture, Icon, OverlayBody, OverlayHeader } from "@component-utils";
  import { EditController, LogController } from "@controllers";
  import { isScrolled } from "@directives";
  import Button from "@interactables/Button.svelte";
  import TextField from "@interactables/TextField.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import type { Song } from "@models";
  import { t } from "@stores/Locale";
  import { showWritingChanges } from "@stores/Overlays";
  import { bulkEditSongIds } from "@stores/Select";
  import { showErrorSnackbar, songsMap } from "@stores/State";
  import { onMount } from "svelte";
  import { pop } from "svelte-spa-router";
  
  let originalArtPath: string | undefined;
  let originalTitle: string | undefined;
  let originalAlbum: string | undefined;
  let originalArtist: string | undefined;
  let originalAlbumArtist: string | undefined;
  let originalComposer: string | undefined;
  let originalGenre: string | undefined;
  let originalTrackNumber: string | undefined;
  let originalReleaseYear: string | undefined;

  let artPath: string | undefined;
  let title: string | undefined;
  let album: string | undefined;
  let artist: string | undefined;
  let albumArtist: string | undefined;
  let composer: string | undefined;
  let genre: string | undefined;
  let trackNumber: string | undefined;
  let releaseYear: string | undefined;

  const differencesLabel = $t("KEEP_VALUE");

  let highlight = false;
  
  $: canSave = (
    artPath !== originalArtPath ||
    title !== originalTitle ||
    album !== originalAlbum ||
    artist !== originalArtist ||
    albumArtist !== originalAlbumArtist ||
    composer !== originalComposer ||
    genre !== originalGenre ||
    trackNumber !== originalTrackNumber ||
    releaseYear !== originalReleaseYear
  );

  /**
   * Initializes the song fields.
   */
  function initializeFields() {
    const songs = $bulkEditSongIds.map((id) => $songsMap[id]);
    const song = songs[0];
    artPath = songs.some((s) => s.artPath !== song.artPath) && !!song.artPath ? differencesLabel : song?.artPath;

    title = songs.some((s) => s.title !== song.title) && !!song.title ? differencesLabel : song!.title ?? "";
    album = songs.some((s) => s.album !== song.album) && !!song.album ? differencesLabel : song!.album ?? "";
    artist = songs.some((s) => s.artist !== song.artist) && !!song.artist ? differencesLabel : song!.artist ?? "";
    albumArtist = songs.some((s) => s.albumArtist !== song.albumArtist) && !!song.albumArtist ? differencesLabel : song?.albumArtist ?? "";
    composer = songs.some((s) => s.composer !== song.composer) && !!song.composer ? differencesLabel : song?.composer ?? "";
    genre = songs.some((s) => s.genre !== song.genre) && !!song.genre ? differencesLabel : song?.genre ?? "";

    const strTrackNum = song.trackNumber?.toString();
    trackNumber = songs.some((s) => s.trackNumber?.toString() !== strTrackNum) && !!song.trackNumber ? differencesLabel : strTrackNum ?? "";
    const strReleaseYear = song.releaseYear.toString();
    releaseYear = songs.some((s) => s.releaseYear.toString() !== strReleaseYear) && song?.releaseYear !== -1 ? differencesLabel : (strReleaseYear === "-1" ? "" : strReleaseYear);

    originalArtPath = artPath;
    originalTitle = title;
    originalAlbum = album;
    originalArtist = artist;
    originalAlbumArtist = albumArtist;
    originalComposer = composer;
    originalGenre = genre;
    originalTrackNumber = trackNumber;
    originalReleaseYear = releaseYear;
  }

  /**
   * Closes the bulk edit page.
   */
  function back() {
    $bulkEditSongIds = [];
    pop();
  }

  function getChangeValue(song: Song, input: string | undefined, field: keyof Song): string | undefined {
    // @ts-expect-error song[field] will always return a string or undefined.
    return input !== "" ? (input === differencesLabel ? song[field] : input) : undefined;
  }

  function isNumeric(str: string): boolean {
    return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
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

    if (trackNumber && trackNumber !== differencesLabel && !isNumeric(trackNumber)) {
      $showErrorSnackbar({ message: $t("TRACK_MUST_BE_NUMBER_MESSAGE"), faster: true });
      LogController.error("Failed to save changes! Track must be a number!");
      return;
    }

    if (releaseYear && releaseYear !== differencesLabel && !isNumeric(releaseYear)) {
      $showErrorSnackbar({ message: $t("YEAR_MUST_BE_NUMBER_MESSAGE"), faster: true });
      LogController.error("Failed to save changes! Release Year must be a number!");
      return;
    }

    const songs = $bulkEditSongIds.map((id) => $songsMap[id]);
    const songPaths: Record<string, string> = {};
    const changes: Record<string, SongEditFields> = {};

    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      
      songPaths[song.id] = song.filePath;
      changes[song.filePath] = {
        "artPath": artPath === differencesLabel ? song.artPath : artPath,
        "title": title === differencesLabel ? song.title : title,
        "album": getChangeValue(song, album, "album"),
        "composer": getChangeValue(song, composer, "composer"),
        "albumArtist": getChangeValue(song, albumArtist, "albumArtist"),
        "artist": getChangeValue(song, artist, "artist"),
        "releaseYear":  releaseYear && releaseYear !== "" ? (releaseYear === differencesLabel ? song.releaseYear : parseInt(releaseYear)) : undefined,
        "genre": getChangeValue(song, genre, "genre"),
        "trackNumber": trackNumber && trackNumber !== "" ? (trackNumber === differencesLabel ? song.trackNumber : parseInt(trackNumber)) : undefined
      }
    }

    $showWritingChanges = true;
    EditController.bulkEditSongs(songPaths, changes).then(() => {
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
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">{$t("BULK_EDITING_TITLE").replace("{count}", $bulkEditSongIds.length.toString())}</div>
      </span>
      <span slot="right">
        <Button type="text" disabled={!canSave} on:click={saveChanges}>
          {$t("SAVE_ACTION")}
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span class="content styled-scrollbar" slot="content" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
    <div class="content-inner">
      <DetailsArtPicture artPath={artPath} failValue={differencesLabel} />
      <div class="fields">
        <TextField name={$t("TITLE_LABEL")} bind:value={title} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("ALBUM_LABEL")} bind:value={album} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("ARTIST_LABEL")} bind:value={artist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("ALBUM_ARTIST_LABEL")} bind:value={albumArtist} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("COMPOSER_LABEL")} bind:value={composer} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <TextField name={$t("GENRE_LABEL")} bind:value={genre} extraWrapperOptions={{ style: "width: 100%; margin-bottom: 10px;" }} />
        <div class="two-wide">
          <TextField name="{$t("TRACK_LABEL")} #" bind:value={trackNumber} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px); margin-right: 10px;" }} />
          <TextField name={$t("YEAR_LABEL")} bind:value={releaseYear} extraWrapperOptions={{ style: "width: calc(50% - 5px); min-width: calc(50% - 5px);" }} />
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

  .two-wide {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    padding-bottom: 40px;
  }
</style>