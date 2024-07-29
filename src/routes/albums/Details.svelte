<script lang="ts">
  import DetailsArtPicture from "@component-utils/DetailsArtPicture.svelte";
  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import { EditController, LogController, PlaybackController, QueueController } from "@controllers";
  import { isScrolled } from "@directives";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import PlayButton from "@interactables/PlayButton.svelte";
  import RadioMenuItem from "@interactables/radio/RadioMenuItem.svelte";
  import ToggleShuffleButton from "@interactables/ToggleShuffleButton.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Filter from "@ktibow/iconset-material-symbols/sort-rounded";
  import AlbumCarousel from "@layout/album-carousel/AlbumCarousel.svelte";
  import Marquee from "@layout/Marquee.svelte";
  import MenuItem from "@layout/MenuItem.svelte";
  import SongsList from "@layout/songs-list/SongsList.svelte";
  import type { Song } from "@models";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { t } from "@stores/Locale";
  import { albumToAdd, showAddToPlaylist } from "@stores/Overlays";
  import { albumsMap, artistsMap, isPaused, nowPlayingList, songsMap, useAlbumColors } from "@stores/State";
  import type { AlbumEntriesSortOrder } from "@types";
  import { goToAlbumEdit, nullishNumberSort, stringSort } from "@utils";
  import { pop, push, replace } from "svelte-spa-router";

  let albumSortMethod: AlbumEntriesSortOrder = "Track Number";

  export let params: { key?: string } = {};
  $: key = params.key;
  $: album = key ? $albumsMap[key!] : undefined;

  $: artist = album?.albumArtist ? $artistsMap[album?.albumArtist] : undefined;
  $: artistOtherAlbums = Array.from(artist?.albumNames ?? []).filter((name) => name !== album?.name).map((name) => $albumsMap[name]);
  
  $: songs = album?.songIds?.map((id) => $songsMap[id]);
  $: sortedSongs = songs ? sortSongs(songs, albumSortMethod) : [];

  $: backgroundColor = $useAlbumColors ? album?.backgroundColor : undefined;

  let highlight = false;

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
    if ($nowPlayingList === album!.name) {
      if (!$isPaused) {
        PlaybackController.pause();
      } else {
        PlaybackController.resume();
      }
    } else {
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
    goToAlbumEdit(params!.key!);
  }

  /**
   * Prompts the user to confirm if they want to delete this album.
   */
  function deleteAlbum() {
    EditController.deleteAlbumsFromDevice([album!.name]);
    replace("/albums");
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

{#key key}
<DetailsBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
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
          <MenuItem on:click={playNext}>{$t("PLAY_NEXT_ACTION")}</MenuItem>
          <MenuItem on:click={queueAlbum}>{$t("ADD_TO_QUEUE_ACTION")}</MenuItem>
          <MenuItem on:click={addToPlaylist}>{$t("ADD_TO_PLAYLIST_ACTION")}</MenuItem>
          <MenuItem on:click={deleteAlbum}>{$t("DELETE_ACTION")}</MenuItem>
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content styled-scrollbar" slot="content" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
    <div class="content-inner">
      <DetailsArtPicture artPath={album?.artPath} />
      <div class="details">
        <div class="info">
          <Marquee speed={50} gap={100}>
            <h3 class="name">{album?.name}</h3>
          </Marquee>
          <div class="font-body other"><div class="album-artist">{album?.albumArtist ? album?.albumArtist : ""}</div>&nbsp;{album?.releaseYear !== -1 ? "• " + album?.releaseYear : ""}{" • " + album?.displayAlbumLength()}</div>
        </div>
        <div class="buttons" style="{backgroundColor ? `--m3-scheme-primary: ${backgroundColor};` : ""}">
          <ToggleShuffleButton />
          <PlayButton name={album?.name} on:click={playAlbum} />
        </div>
      </div>
      <div class="songs" style="margin-top: 5px;">
        <div class="section-header">
          <h3 class="label">{$t("SONGS_TITLE")}</h3>
          <MenuButton icon={Filter}>
            <RadioMenuItem name="albumEntriesSort" label="Alphabetical" checked={albumSortMethod === "Alphabetical"} on:input={() => albumSortMethod = "Alphabetical" } />
            <RadioMenuItem name="albumEntriesSort" label="Track Number" checked={albumSortMethod === "Track Number"} on:input={() => albumSortMethod = "Track Number"} />
            <RadioMenuItem name="albumEntriesSort" label="Song Duration" checked={albumSortMethod === "Song Duration"} on:input={() => albumSortMethod = "Song Duration"} />
          </MenuButton>
        </div>
        <SongsList songs={sortedSongs} />
      </div>
      {#if album && artist && artist.albumNames.size > 1}
        <AlbumCarousel label="{$t("MORE_FROM_TITLE")} {album?.albumArtist}" albums={artistOtherAlbums} on:click={showAllAlbums} />
      {/if}
      <div style="width: 100%; height: 70px;" />
    </div>
  </span>
</DetailsBody>
{/key}


<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
  }

  .content-inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info {
    margin-top: 10px;
    width: calc(100% - 110px);
  }

  .name {
    margin: 0px;

    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
  }

  .other {
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

  .songs {
    width: 100%;
  }

  .songs .section-header {
    width: calc(100% - 20px);
    margin-left: 15px;
  }

  .album-artist {
    max-width: 70%;
    overflow: hidden;
    text-wrap: nowrap;
    text-overflow: ellipsis;
  }
</style>