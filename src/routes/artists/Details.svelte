<script lang="ts">
  import Button from "../../components/interactables/Button.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import ForwardArrow from "@ktibow/iconset-material-symbols/arrow-forward-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import Filter from "@ktibow/iconset-material-symbols/sort-rounded";
  import type { ArtistEntriesSortOrder } from "../../types/Settings";
  import { albumsMap, artistsMap, songsMap, useArtistColors } from "../../stores/State";
  import { artistToAdd, showAddToPlaylist } from "../../stores/Overlays";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import DetailsBody from "../../components/utils/DetailsBody.svelte";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import MenuButton from "../../components/interactables/MenuButton.svelte";
  import RadioMenuItem from "../../components/interactables/RadioMenuItem.svelte";
  import ColoredButton from "../../components/interactables/ColoredButton.svelte";
  import { pop, push } from "svelte-spa-router";
  import AlbumCarousel from "../../components/layout/album-carousel/AlbumCarousel.svelte";
  import type { Song } from "../../lib/models/Song";
  import { getRandomElements, stringSort } from "../../lib/utils/Utils";
  import { LogController } from "../../lib/controllers/LogController";
  import SongsList from "../../components/layout/songs-list/SongsList.svelte";
  import ArtistCarousel from "../../components/layout/artist-carousel/ArtistCarousel.svelte";
  import { Artist } from "../../lib/models/Artist";
  import MenuItem from "../../components/layout/MenuItem.svelte";

  let artistSortMethod: ArtistEntriesSortOrder = "Album";

  export let params: { key?: string } = {};
  $: artist = params.key ? $artistsMap[params!.key!] : undefined;
  $: artistAlbums = Array.from(artist?.albumNames ?? []).map((name) => $albumsMap[name]);

  $: songs = artist?.songKeys?.map((key) => $songsMap[key]);
  $: sortedSongs = songs ? sortSongs(songs, artistSortMethod) : [];

  $: allSimilarArtists = artist?.similarArtists;
  // @ts-ignore
  $: similarArtists = (allSimilarArtists && allSimilarArtists?.length > 5) ? getRandomElements<Artist>(allSimilarArtists, 5) : similarArtists;

  let isAtTop = true;

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
    PlaybackController.playArtist(artist!);
  }

  /**
   * Shuffles then plays this artist.
   */
  function playShuffledArtist() {
    PlaybackController.playArtist(artist!, true);
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
    <DetailsArtPicture artPath={artist?.imagePath} />
    <div class="details">
      <div class="info">
        <h3 class="name">{artist?.name}</h3>
        <div class="other">{artist?.albumNames.size + ` Album${artist?.albumNames.size === 1 ? "" : "s"} • `}{artist?.songKeys.length + ` Song${artist?.songKeys.length === 1 ? "" : "s"} • `}{artist?.displayArtistSongLength()}</div>
      </div>
      <div class="buttons" style="{(artist?.backgroundColor && $useArtistColors) ? `--m3-scheme-primary: ${artist.backgroundColor};` : ""}">
        <ColoredButton type="outlined" extraOptions={{ style: "display: flex; width: calc(50% - 10px)" }} on:click={playArtist}>
          <Icon icon={Play} /> Play All
        </ColoredButton>
        <ColoredButton type="filled" extraOptions={{ style: "display: flex; width: calc(50% - 10px)" }} on:click={playShuffledArtist}>
          <Icon icon={Shuffle} /> Shuffle
        </ColoredButton>
      </div>
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
    width: 100%;
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
  }

  .similar,
  .albums,
  .songs {
    width: 100%;
  }

  .similar {
    margin-top: 5px;
  }

  .similar .section-header,
  .albums .section-header,
  .songs .section-header {
    width: calc(100% - 30px);
    margin-left: 15px;
  }

  .albums .section-header {
    margin-top: 15px;
    margin-bottom: 5px;
  }
  
  .similar .section-header {
    width: calc(100% - 20px);
  }
</style>