<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import { albumViewing, artistViewing, showAddToPlaylist, showAlbumDetails, showEditSong, showSongDetails, songToAdd, songViewing } from "../../../stores/Overlays";
  import { songsMap } from "../../../stores/State";
  import Lazy from "../../layout/Lazy.svelte";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import OverlayBody from "../utils/OverlayBody.svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import DetailsField from "./DetailsField.svelte";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import { AppController } from "../../../lib/controllers/AppController";
  
  import Sell from "@ktibow/iconset-material-symbols/sell";
  import Album from "@ktibow/iconset-material-symbols/album";
  import Artist from "@ktibow/iconset-material-symbols/artist";
  import ReleaseYear from "@ktibow/iconset-material-symbols/today-rounded";
  import Genre from "@ktibow/iconset-material-symbols/library-music-rounded";
  import TrackNumber from "@ktibow/iconset-material-symbols/tag-rounded";
  import Duration from "@ktibow/iconset-material-symbols/schedule-rounded"
  import Frequency from "@ktibow/iconset-material-symbols/graphic-eq-rounded"
  import Location from "@ktibow/iconset-material-symbols/folder-open-rounded";
  import FileSize from "@ktibow/iconset-material-symbols/hard-drive-2";
  
  $: song = $songViewing ? $songsMap[$songViewing] : null;
  $: convertedPath = song?.artPath ? tauri.convertFileSrc(song.artPath) : "";

  let imageSize = 335;

  let isAtTop = true;

  /**
   * Closes the details overlay.
   */
  function back() {
    $songViewing = null;
    $showSongDetails = false;
  }

  /**
   * Handles closing the options.
   */
   function closeDetails() {
    $songViewing = null;
    $showSongDetails = false;
  }

  /**
   * Plays this song.
   */
  function playSong() {
    PlaybackController.playSong(song!);
    closeDetails();
  }

  /**
   * Plays this song next.
   */
  function playNext() {
    QueueController.playSongsNext([song!.title]);
    closeDetails();
  }

  /**
   * Queues this song.
   */
  function queueSong() {
    QueueController.queueSongs([song!.title]);
    closeDetails();
  }

  /**
   * Opens the add to playlist dialog with this song set to be added.
   */
  function addToPlaylist() {
    $songToAdd = song!.title;
    $showAddToPlaylist = true;
    closeDetails();
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    $albumViewing = song!.album!;
    $showAlbumDetails = true;
    closeDetails();
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    $artistViewing = song!.artist!;
    closeDetails();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    $songViewing = song!.title;
    $showEditSong = true;
  }

  /**
   * Opens the platform's share ui.
   */
  function share() {
    AppController.share([song!.title]);
    closeDetails();
  }

  /**
   * Prompts the user to confirm if they want to delete this song.
   */
  function deleteSong() {
    AppController.deleteFromDevice([song!.title]);
    closeDetails();
  }
</script>

<OverlayBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
      <span slot="left">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
      </span>
      <span slot="right" style="display: flex; flex-direction: row;">
        <Button type="text" iconType="full" on:click={showSongEdit}>
          <Icon icon={Edit} width="20px" height="20px" />
        </Button>
        <div style="height: 100%; width: 5px;" />
        <MenuButton icon={MoreVert}>
          <Menu>
            <MenuItem on:click={playSong}>Play</MenuItem>
            <MenuItem on:click={playNext}>Play Next</MenuItem>
            <MenuItem on:click={queueSong}>Add to Queue</MenuItem>
            <MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
            {#if song?.album}
              <MenuItem on:click={goToAlbum}>Go to Album</MenuItem>
            {/if}
            {#if song?.artist}
              <MenuItem on:click={goToArtist}>Go to Artist</MenuItem>
            {/if}
            <MenuItem on:click={share}>Share</MenuItem>
            <MenuItem on:click={deleteSong}>Delete</MenuItem>
          </Menu>
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <div class="album-picture" style="max-width: {imageSize}px; max-height: {imageSize}px;">
      <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{convertedPath}" style="width: auto; height: auto; max-width: {imageSize}px; max-height: {imageSize}px;" draggable="false" on:error={onError} />
        <span slot="placeholder">
          <MusicNotePlaceholder height={80} width={80} />
        </span>
      </Lazy>
    </div>
    <div class="details">
      <DetailsField icon={Sell} headline={song?.title} />
      <DetailsField icon={Album} headline={song?.album ?? "Unkown"} />
      <DetailsField icon={Artist} headline={song?.artist ?? "Unkown"} />
      <DetailsField icon={ReleaseYear} headline={song?.releaseYear === -1 ? "Unkown" : song?.releaseYear.toString()} />
      <DetailsField icon={Genre} headline={song?.genre ?? "Unkown"} />
      <DetailsField icon={TrackNumber} headline={song?.displayTrack()} />
      <DetailsField icon={Duration} headline={song?.displayLength()} />
      <DetailsField icon={Frequency} headline={song?.displayFrequency()} />
      <DetailsField icon={Location} supporting={song?.filePath} />
      <DetailsField icon={FileSize} headline={song?.displaySize()} />
    </div>
  </span>
</OverlayBody>

<style>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 40px;
  }

  .album-picture {
    margin-top: 2px;
    width: calc(100% - 40px);
    max-width: 360px;
    max-height: 360px;
    border-radius: 10px;
    overflow: hidden;
  }

  .details {
    width: 100%;
  }
</style>