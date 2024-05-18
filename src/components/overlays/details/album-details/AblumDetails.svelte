<script lang="ts">
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import OverlayHeader from "../../utils/OverlayHeader.svelte";
  import { albumsMap, artistsMap } from "../../../../stores/State";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Filter from "@ktibow/iconset-material-symbols/sort-rounded";
  import MenuButton from "../../../interactables/MenuButton.svelte";
  import { showAlbumDetails, showEditAlbum, albumViewing, albumToAdd, showAddToPlaylist } from "../../../../stores/Overlays";
  import { AppController } from "../../../../lib/controllers/AppController";
  import { QueueController } from "../../../../lib/controllers/QueueController";
  import { PlaybackController } from "../../../../lib/controllers/PlaybackController";
  import DetailsBody from "../DetailsBody.svelte";
  import type { Album } from "../../../../lib/models/Album";
  import { onMount } from "svelte";
  import RadioMenuItem from "../../../interactables/RadioMenuItem.svelte";
  import type { AlbumEntriesSortOrder } from "../../../../types/Settings";
  import AlbumEntries from "./AlbumEntries.svelte";
  import SimilarAlbums from "./SimilarAlbums.svelte";
  import DetailsArtPicture from "../../utils/DetailsArtPicture.svelte";

  let albumSortMethod: AlbumEntriesSortOrder = "Track Number";

  let album: Album;

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
            <RadioMenuItem name="albumEntriesSort" label="Alphabetical" checked={albumSortMethod === "Alphabetical"} on:input={() => albumSortMethod = "Alphabetical" } />
            <RadioMenuItem name="albumEntriesSort" label="Track Number" checked={albumSortMethod === "Track Number"} on:input={() => albumSortMethod = "Track Number"} />
            <RadioMenuItem name="albumEntriesSort" label="Song Duration" checked={albumSortMethod === "Song Duration"} on:input={() => albumSortMethod = "Song Duration"} />
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
    <DetailsArtPicture artPath={album?.artPath} />
    <div class="details">
      <div class="info">
        <h3 class="name">{album?.name}</h3>
        <div class="other">{album?.albumArtist ? album?.albumArtist + " • " : ""}{album?.releaseYear !== -1 ? album?.releaseYear + " • " : ""}{album?.displayAlbumLength()}</div>
      </div>
      <div class="buttons">

      </div>
    </div>
    <div class="songs">
      <h3 class="section-header">Songs</h3>
      <AlbumEntries songKeys={album?.songKeys ?? []} sortOrder={albumSortMethod} />
    </div>
    {#if album?.albumArtist}
      <div class="similar">
        <h3 class="section-header">More from {album?.albumArtist}</h3>
        <SimilarAlbums albumArtist={album?.albumArtist} />
      </div>
    {/if}
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

  .info {
    margin-top: 10px;
    width: calc(100% - 5px);
    margin-left: 5px;
  }

  .name {
    margin: 0px;
    margin-bottom: 5px;
  }

  .other {
    font-size: 14px;
    color: rgb(var(--m3-scheme-outline));
  }

  .section-header {
    font-weight: bold;
    margin: 10px;
  }

  .details {
    width: 100%;
  }

  .songs {
    width: 100%;
    margin-right: 10px;
  }

  .similar {
    width: 100%;
  }
</style>