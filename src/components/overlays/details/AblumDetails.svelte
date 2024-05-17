<script lang="ts">
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import OverlayHeader from "../utils/OverlayHeader.svelte";
  import { albumsMap } from "../../../stores/State";
  import Lazy from "../../layout/Lazy.svelte";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import MusicNotePlaceholder from "../../layout/placeholders/MusicNotePlaceholder.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Filter from "@ktibow/iconset-material-symbols/sort-rounded";
  import MenuButton from "../../interactables/MenuButton.svelte";
  import { tauri } from "@tauri-apps/api";
  import { showAlbumDetails, showEditAlbum, albumViewing, albumToAdd, showAddToPlaylist } from "../../../stores/Overlays";
  import { AppController } from "../../../lib/controllers/AppController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import DetailsBody from "./DetailsBody.svelte";
  import type { Album } from "../../../lib/models/Album";
  import { onMount } from "svelte";
    import RadioMenuItem from "../../interactables/RadioMenuItem.svelte";

  let album: Album;
  $: convertedPath = album?.artPath ? tauri.convertFileSrc(album?.artPath) : "";

  let imageSize = 335;

  let isAtTop = true;

  /**
   * Closes the details overlay.
   */
   function back() {
    $showAlbumDetails = false;
    $albumViewing = null;
  }

  /**
   * Plays this album.
   */
  function playAlbum() {
    PlaybackController.playAlbum(album!);
    back();
  }

  /**
   * Plays this album next.
   */
  function playNext() {
    QueueController.playAlbumsNext([album!.name]);
    back();
  }

  /**
   * Queues this album.
   */
  function queueAlbum() {
    QueueController.queueSongs([album!.name]);
    back();
  }

  /**
   * Opens the add to playlist dialog with this song set to be added.
   */
  function addToPlaylist() {
    $albumToAdd = album!.name;
    $showAddToPlaylist = true;
  }

  /**
   * Shows the album view sort.
   */
  function showAlbumViewSort() {
    
  }

  /**
   * Shows the edit song overlay.
   */
  function showAlbumEdit() {
    $showEditAlbum = true;
  }

  /**
   * Prompts the user to confirm if they want to delete this album.
   */
  function deleteAlbum() {
    AppController.deleteAlbumsFromDevice([album!.name]);
    back();
  }

  onMount(() => {
    album = $albumsMap[$albumViewing!];
  });
</script>

<DetailsBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
      <span slot="left">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
      </span>
      <span slot="right" style="display: flex; flex-direction: row;">
        <MenuButton icon={Filter}>
          <Menu>
            <RadioMenuItem name="albumEntriesSort" label="Alphabetical" on:input={() => {}} />
            <RadioMenuItem name="albumEntriesSort" label="Track Number" on:input={() => {}} />
            <RadioMenuItem name="albumEntriesSort" label="Song Duration" on:input={() => {}} />
          </Menu>
        </MenuButton>
        <div style="height: 100%; width: 5px;" />
        <Button type="text" iconType="full" on:click={showAlbumEdit}>
          <Icon icon={Edit} width="20px" height="20px" />
        </Button>
        <div style="height: 100%; width: 5px;" />
        <MenuButton icon={MoreVert}>
          <Menu>
            <MenuItem on:click={playNext}>Play Next</MenuItem>
            <MenuItem on:click={queueAlbum}>Add to Queue</MenuItem>
            <MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
            <MenuItem on:click={deleteAlbum}>Delete</MenuItem>
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
      <!-- <DetailsField icon={Sell} headline={song?.title} />
      <DetailsFieldeleteSongsFromDeviceeadline={song?.album ?? "Unkown"} />
      <DetailsField icon={Artist} headline={song?.artist ?? "Unkown"} />
      <DetailsField icon={ReleaseYear} headline={song?.releaseYear === -1 ? "Unkown" : song?.releaseYear.toString()} />
      <DetailsField icon={Genre} headline={song?.genre ?? "Unkown"} />
      <DetailsField icon={TrackNumber} headline={song?.displayTrack()} />
      <DetailsField icon={Duration} headline={song?.displayLength()} />
      <DetailsField icon={Frequency} headline={song?.displayFrequency()} />
      <DetailsField icon={Location} supporting={song?.filePath} />
      <DetailsField icon={FileSize} headline={song?.displaySize()} /> -->
    </div>
  </span>
</DetailsBody>

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