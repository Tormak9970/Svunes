<script lang="ts">
  import Button from "../../components/interactables/Button.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import ForwardArrow from "@ktibow/iconset-material-symbols/arrow-forward-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Filter from "@ktibow/iconset-material-symbols/sort-rounded";
  import type { ArtistEntriesSortOrder } from "../../types/Settings";
  import { albumsMap, artists, artistsMap, isPaused, nowPlayingList, songsMap, useArtistColors } from "../../stores/State";
  import { artistToAdd, showAddToPlaylist } from "../../stores/Overlays";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import DetailsBody from "../../components/utils/DetailsBody.svelte";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import MenuButton from "../../components/interactables/MenuButton.svelte";
  import RadioMenuItem from "../../components/interactables/RadioMenuItem.svelte";
  import { pop, push } from "svelte-spa-router";
  import AlbumCarousel from "../../components/layout/album-carousel/AlbumCarousel.svelte";
  import type { Song } from "../../lib/models/Song";
  import { getRandomElements, pluralize } from "../../lib/utils/Utils";
  import { stringSort } from "../../lib/utils/Sorters";
  import { LogController } from "../../lib/controllers/utils/LogController";
  import SongsList from "../../components/layout/songs-list/SongsList.svelte";
  import ArtistCarousel from "../../components/layout/artist-carousel/ArtistCarousel.svelte";
  import { Artist } from "../../lib/models/Artist";
  import MenuItem from "../../components/layout/MenuItem.svelte";
  import ToggleShuffleButton from "../../components/views/utils/ToggleShuffleButton.svelte";
  import PlayButton from "../../components/views/utils/PlayButton.svelte";
  import Marquee from "../../components/layout/Marquee.svelte";
  import { onArtOptionsDone, showArtOptions } from "../../stores/Modals";
  import { EditController } from "../../lib/controllers/EditController";

  let artistSortMethod: ArtistEntriesSortOrder = "Album";

  export let params: { key?: string } = {};
  $: artist = params.key ? $artistsMap[params!.key!] : undefined;
  $: artistAlbums = Array.from(artist?.albumNames ?? []).map((name) => $albumsMap[name]);

  $: songs = artist?.songIds?.map((id) => $songsMap[id]);
  $: sortedSongs = songs ? sortSongs(songs, artistSortMethod) : [];

  $: allSimilarArtists = artist?.similarArtists;
  // @ts-ignore
  $: similarArtists = (allSimilarArtists && allSimilarArtists?.length > 5) ? getRandomElements<Artist>(allSimilarArtists, 5) : similarArtists;

  let isAtTop = true;
  let rerenderArt = false;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }

  /**
   * Plays this artist.
   */
  function playArtist() {
    if ($nowPlayingList === artist!.name) {
      if (!$isPaused) {
        PlaybackController.pause();
      } else {
        PlaybackController.resume();
      }
    } else {
      PlaybackController.playArtist(artist!);
    }
  }

  /**
   * Plays this artist next.
   */
  function playNext() {
    QueueController.playArtistsNext([artist!.name]);
  }

  /**
   * Queues this artist.
   */
  function queueArtist() {
    QueueController.queueArtists([artist!.name]);
  }

  /**
   * Opens the add to playlist dialog with this artist set to be added.
   */
  function addToPlaylist() {
    $artistToAdd = artist!.name
    $showAddToPlaylist = true;
  }

  /**
   * Shows all similar artists.
   */
  function showAllSimilar() {
    push(`/artists/${params.key}/similar`);
  }

  /**
   * Sorts the artist's songs.
   * @param songsList The list of songs.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortSongs(songsList: Song[], sortOrder: ArtistEntriesSortOrder): Song[] {
    let sorted: Song[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = songsList.sort(stringSort<Song>("title"));
    } else if (sortOrder === "Album") {
      sorted = songsList.sort(stringSort<Song>("album"));
    } else if (sortOrder === "Year") {
      sorted = songsList.sort((a: Song, b: Song) => b.releaseYear - a.releaseYear);
    } else if (sortOrder === "Song Duration") {
      sorted = songsList.sort((a: Song, b: Song) => a.length - b.length);
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  /**
   * Handles prompting the user to change the artist's art.
   */
  function onArtistArtClick() {
    $onArtOptionsDone = async (path: string | undefined) => {
      artist!.imagePath = await EditController.copyArtistImage(path);
      await artist?.setBackgroundFromImage();
      $artists = [ ...$artists ];
      rerenderArt = !rerenderArt;
    }
    $showArtOptions = true;
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
        <MenuButton icon={MoreVert}>
          <MenuItem on:click={playNext}>Play Next</MenuItem>
          <MenuItem on:click={queueArtist}>Add to Queue</MenuItem>
          <MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    {#key rerenderArt}
      <DetailsArtPicture artPath={artist?.imagePath} clickable on:click={onArtistArtClick} />
    {/key}
    <div class="details">
      <div class="info">
        <Marquee pauseOnHover speed={50} gap={100}>
          <h3 class="name">{artist?.name}</h3>
        </Marquee>
        <div class="other">{`${artist?.albumNames.size} ${pluralize("Album", artist?.albumNames.size)} • `}{`${artist?.songIds.length} ${pluralize("Song", artist?.songIds.length)} • `}{artist?.displayArtistSongLength()}</div>
      </div>
      {#key rerenderArt}
        <div class="buttons" style="{(artist?.backgroundColor && $useArtistColors) ? `--m3-scheme-primary: ${artist.backgroundColor};` : ""}">
          <ToggleShuffleButton />
          <PlayButton name={artist?.name} on:click={playArtist} />
        </div>
      {/key}
    </div>
    {#if artistAlbums.length > 0 }
      <div class="albums">
        <div class="section-header">
          <h3 class="label">Albums</h3>
          <div />
        </div>
        <AlbumCarousel albums={artistAlbums} />
      </div>
    {/if}
    <div class="songs">
      <div class="section-header">
        <h3 class="label">Songs</h3>
        <MenuButton icon={Filter}>
          <RadioMenuItem name="artistEntriesSort" label="Alphabetical" checked={artistSortMethod === "Alphabetical"} on:input={() => artistSortMethod = "Alphabetical" } />
          <RadioMenuItem name="artistEntriesSort" label="Album" checked={artistSortMethod === "Album"} on:input={() => artistSortMethod = "Album"} />
          <RadioMenuItem name="artistEntriesSort" label="Year" checked={artistSortMethod === "Year"} on:input={() => artistSortMethod = "Year"} />
          <RadioMenuItem name="artistEntriesSort" label="Song Duration" checked={artistSortMethod === "Song Duration"} on:input={() => artistSortMethod = "Song Duration"} />
        </MenuButton>
      </div>
      <SongsList songs={sortedSongs} />
    </div>
    {#if similarArtists && similarArtists?.length > 0}
      <div class="similar">
        <div class="section-header">
          <h3 class="label">Similar Artists</h3>
          <Button type="text" iconType="full" on:click={showAllSimilar}>
            <Icon icon={ForwardArrow} width="20px" height="20px" />
          </Button>
        </div>
        <ArtistCarousel artists={similarArtists} />
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
  }

  .section-header {
    margin-top: 5px;
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
    margin-bottom: 5px;
    
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
  .albums,
  .songs {
    width: 100%;
  }

  .similar .section-header,
  .albums .section-header,
  .songs .section-header {
    width: calc(100% - 20px);
    margin-left: 15px;
  }

  .albums .section-header {
    margin-bottom: 10px; /* this accounts for other containers having padding on the following element */
  }
</style>