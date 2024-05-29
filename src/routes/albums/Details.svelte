<script lang="ts">
  import Button from "../../components/interactables/Button.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import ForwardArrow from "@ktibow/iconset-material-symbols/arrow-forward-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import Filter from "@ktibow/iconset-material-symbols/sort-rounded";
  import AlbumCarousel from "../../components/layout/album-carousel/AlbumCarousel.svelte";
  import type { AlbumEntriesSortOrder } from "../../types/Settings";
  import { albumsMap, artistsMap, isPaused, nowPlayingListName, songsMap, useAlbumColors } from "../../stores/State";
  import { albumToAdd, showAddToPlaylist } from "../../stores/Overlays";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import { AppController } from "../../lib/controllers/AppController";
  import DetailsBody from "../../components/utils/DetailsBody.svelte";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import MenuButton from "../../components/interactables/MenuButton.svelte";
  import RadioMenuItem from "../../components/interactables/RadioMenuItem.svelte";
  import ColoredButton from "../../components/interactables/ColoredButton.svelte";
  import { pop, push } from "svelte-spa-router";
  import { LogController } from "../../lib/controllers/LogController";
  import type { Song } from "../../lib/models/Song";
  import { nullishNumberSort, stringSort } from "../../lib/utils/Sorters";
  import SongsList from "../../components/layout/songs-list/SongsList.svelte";
  import MenuItem from "../../components/layout/MenuItem.svelte";
    import ToggleShuffleButton from "../../components/views/utils/ToggleShuffleButton.svelte";
    import PlayButton from "../../components/views/utils/PlayButton.svelte";
    import Marquee from "../../components/layout/Marquee.svelte";

  let albumSortMethod: AlbumEntriesSortOrder = "Track Number";

  export let params: { key?: string } = {};
  $: album = params.key ? $albumsMap[params!.key!] : undefined;

  $: artist = album?.albumArtist ? $artistsMap[album?.albumArtist] : undefined;
  $: artistOtherAlbums = Array.from(artist?.albumNames ?? []).filter((name) => name !== album?.name).map((name) => $albumsMap[name]);
  
  $: songs = album?.songKeys?.map((key) => $songsMap[key]);
  $: sortedSongs = songs ? sortSongs(songs, albumSortMethod) : [];

  let isAtTop = true;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }

  /**
   * Plays this album.
   */
  function playAlbum() {
    if (!$isPaused && $nowPlayingListName === album!.name) {
      $isPaused = true;
    } else {
      $isPaused = false;
      $nowPlayingListName = album!.name;
      PlaybackController.playAlbum(album!);
    }
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
    QueueController.queueAlbums([album!.name]);
  }

  /**
   * Opens the add to playlist dialog with this album set to be added.
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

  /**
   * Shows all albums by artist.
   */
  function showAllAlbums() {
    push(`/albums/${params.key}/albums-by-artist`);
  }

  /**
   * Sorts the album's songs.
   * @param songsList The list of songs.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortSongs(songsList: Song[], sortOrder: AlbumEntriesSortOrder): Song[] {
    let sorted: Song[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = songsList.sort(stringSort<Song>("title"));
    } else if (sortOrder === "Track Number") {
      sorted = songsList.sort(nullishNumberSort<Song>("trackNumber"));
    } else if (sortOrder === "Song Duration") {
      sorted = songsList.sort((a: Song, b: Song) => a.length - b.length);
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }
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
        <Button type="text" iconType="full" on:click={showAlbumEdit}>
          <Icon icon={Edit} width="20px" height="20px" />
        </Button>
        <div style="height: 100%; width: 5px;" />
        <MenuButton icon={MoreVert}>
          <MenuItem on:click={playNext}>Play Next</MenuItem>
          <MenuItem on:click={queueAlbum}>Add to Queue</MenuItem>
          <MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
          <MenuItem on:click={deleteAlbum}>Delete</MenuItem>
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <DetailsArtPicture artPath={album?.artPath} />
    <div class="details">
      <div class="info">
        <Marquee pauseOnHover speed={50} gap={100}>
          <h3 class="name">{album?.name}</h3>
        </Marquee>
        <div class="other"><div class="album-artist">{album?.albumArtist ?? ""}</div>{album?.albumArtist ? " • " : ""}{album?.releaseYear !== -1 ? album?.releaseYear : ""}{album?.releaseYear !== -1 ? " • " : ""}{album?.displayAlbumLength()}</div>
      </div>
      <div class="buttons" style="{(album?.backgroundColor && $useAlbumColors) ? `--m3-scheme-primary: ${album.backgroundColor};` : ""}">
        <ToggleShuffleButton />
        <PlayButton name={album?.name} on:click={playAlbum} />
      </div>
    </div>
    <div class="songs" style="margin-top: 5px;">
      <div class="section-header">
        <h3 class="label">Songs</h3>
        <MenuButton icon={Filter}>
          <RadioMenuItem name="albumEntriesSort" label="Alphabetical" checked={albumSortMethod === "Alphabetical"} on:input={() => albumSortMethod = "Alphabetical" } />
          <RadioMenuItem name="albumEntriesSort" label="Track Number" checked={albumSortMethod === "Track Number"} on:input={() => albumSortMethod = "Track Number"} />
          <RadioMenuItem name="albumEntriesSort" label="Song Duration" checked={albumSortMethod === "Song Duration"} on:input={() => albumSortMethod = "Song Duration"} />
        </MenuButton>
      </div>
      <SongsList songs={sortedSongs} />
    </div>
    {#if album && artist && artist.albumNames.size > 1}
      <div class="similar">
        <div class="section-header">
          <h3 class="label">More from {album?.albumArtist}</h3>
          <Button type="text" iconType="full" on:click={showAllAlbums}>
            <Icon icon={ForwardArrow} width="20px" height="20px" />
          </Button>
        </div>
        <AlbumCarousel albums={artistOtherAlbums} />
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
    width: calc(100% - 110px);
  }

  .name {
    margin: 0px;
    margin-bottom: 5px;

    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
  }

  .other {
    font-size: 14px;
    color: rgb(var(--m3-scheme-outline));

    display: flex;
    align-items: center;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .section-header .label {
    font-weight: bold;
    margin: 0px;
  }

  .details {
    width: calc(100% - 30px);
    margin: 0px 15px;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .buttons {
    display: flex;
    align-items: center;

    gap: 10px;
  }

  .similar,
  .songs {
    width: 100%;
  }

  .similar .section-header,
  .songs .section-header {
    width: calc(100% - 20px);
    margin-left: 15px;
  }

  .album-artist {
    max-width: 80%;
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
  }

  
  .similar .section-header {
    width: calc(100% - 20px);
    margin-bottom: 5px;
  }
</style>