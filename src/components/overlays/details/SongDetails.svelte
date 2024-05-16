<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import { albumViewing, artistViewing, showAddToPlaylist, showAlbumDetails, showEditSong, showSongDetails, songToAdd, songViewing } from "../../../stores/Overlays";
  import { songsMap } from "../../../stores/State";
  import Lazy from "../../layout/Lazy.svelte";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import FullscreenOverlayBody from "../utils/FullscreenOverlayBody.svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import { AppController } from "../../../lib/controllers/AppController";
  
  $: song = $songViewing ? $songsMap[$songViewing] : null;
  $: convertedPath = song?.albumPath ? tauri.convertFileSrc(song.albumPath) : "";

  let imageSize = 360;

  let highlight = false;

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
    QueueController.playNext([song!.title]);
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
    $albumViewing = song!.album;
    $showAlbumDetails = true;
    closeDetails();
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    $artistViewing = song!.artist;
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

<FullscreenOverlayBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
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
            <MenuItem on:click={goToAlbum}>Go to Album</MenuItem>
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
    <div class="album-picture">
      <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS}>
        <!-- svelte-ignore missing-declaration -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{convertedPath}" style="width: auto; height: auto; max-width: {imageSize}px; max-height: {imageSize}px;" draggable="false" />
        <span slot="placeholder">
          <MusicNotePlaceholder />
        </span>
      </Lazy>
    </div>
    <div class="details">
      
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
    width: calc(100% - 40px);
    max-width: 360px;
    max-height: 360px;
    border-radius: 10px;
    overflow: hidden;
  }

  .details {

  }
</style>