<script lang="ts">
  import { Button, Icon, Menu, MenuItem } from "m3-svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import Filter from "@ktibow/iconset-material-symbols/sort-rounded";
  import { onMount } from "svelte";
  import AlbumEntries from "./AlbumEntries.svelte";
  import SimilarAlbums from "./SimilarAlbums.svelte";
  import type { AlbumEntriesSortOrder } from "../../../types/Settings";
  import type { Album } from "../../../lib/models/Album";
  import { albumsMap, artistsMap } from "../../../stores/State";
  import { albumToAdd, showAddToPlaylist } from "../../../stores/Overlays";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import { AppController } from "../../../lib/controllers/AppController";
  import DetailsBody from "../../../components/utils/DetailsBody.svelte";
  import DetailsArtPicture from "../../../components/utils/DetailsArtPicture.svelte";
  import OverlayHeader from "../../../components/overlays/utils/OverlayHeader.svelte";
  import MenuButton from "../../../components/interactables/MenuButton.svelte";
  import RadioMenuItem from "../../../components/interactables/RadioMenuItem.svelte";
  import ColoredButton from "../../../components/interactables/ColoredButton.svelte";
  import { push } from "svelte-spa-router";

  let albumSortMethod: AlbumEntriesSortOrder = "Track Number";

  export let params: { key?: string } = {};
  let album: Album;

  $: artist = album?.albumArtist ? $artistsMap[album?.albumArtist] : undefined;

  let isAtTop = true;

  /**
   * Closes the details overlay.
   */
   function back() {
    history.back();
  }

  /**
   * Plays this album.
   */
  function playAlbum() {
    PlaybackController.playAlbum(album!);
  }

  /**
   * Shuffles then plays this album.
   */
  function playShuffledAlbum() {
    PlaybackController.playAlbum(album!, true);
  }

  /**
   * Plays this album next.
   */
  function playNext() {
    QueueController.playAlbumsNext([album!.name]);
  }

  /**
   * Queues this album.
   */
  function queueAlbum() {
    QueueController.queueSongs([album!.name]);
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
    push(`/albums/${params!.key!}/edit`);
  }

  /**
   * Prompts the user to confirm if they want to delete this album.
   */
  function deleteAlbum() {
    AppController.deleteAlbumsFromDevice([album!.name]);
  }

  onMount(() => {
    album = $albumsMap[params!.key!];
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
      <div class="buttons" style="{album?.backgroundColor ? `--m3-scheme-primary: ${album.backgroundColor};` : ""}">
        <ColoredButton type="outlined" extraOptions={{ style: "display: flex; width: calc(50% - 10px)" }} on:click={playAlbum}>
          <Icon icon={Play} /> Play All
        </ColoredButton>
        <ColoredButton type="filled" extraOptions={{ style: "display: flex; width: calc(50% - 10px)" }} on:click={playShuffledAlbum}>
          <Icon icon={Shuffle} /> Shuffle
        </ColoredButton>
      </div>
    </div>
    <div class="songs">
      <h3 class="section-header">Songs</h3>
      <AlbumEntries songKeys={album?.songKeys ?? []} sortOrder={albumSortMethod} />
    </div>
    {#if artist && artist.albumNames.size > 1}
      <div class="similar">
        <h3 class="section-header">More from {album?.albumArtist}</h3>
        <SimilarAlbums artist={artist} currentAlbumName={album.name} />
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

  .buttons {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
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