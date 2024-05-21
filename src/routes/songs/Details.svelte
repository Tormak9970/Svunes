<script lang="ts">
  import { showAddToPlaylist, songToAdd } from "../../stores/Overlays";
  import { songsMap } from "../../stores/State";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import { Button, Icon } from "m3-svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import MenuButton from "../../components/interactables/MenuButton.svelte";
  import DetailsField from "./DetailsField.svelte";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import { AppController } from "../../lib/controllers/AppController";
  
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
  import DetailsBody from "../../components/utils/DetailsBody.svelte";
  import DetailsArtPicture from "../../components/utils/DetailsArtPicture.svelte";
  import { pop, push } from "svelte-spa-router";
  import MenuItem from "../../components/layout/MenuItem.svelte";
  
  export let params: { key?: string } = {};
  $: song = params.key ? $songsMap[params.key] : null;

  let isAtTop = true;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }

  /**
   * Plays this song.
   */
  function playSong() {
    PlaybackController.playSong(song!);
  }

  /**
   * Plays this song next.
   */
  function playNext() {
    QueueController.playSongsNext([song!.key]);
  }

  /**
   * Queues this song.
   */
  function queueSong() {
    QueueController.queueSongs([song!.key]);
  }

  /**
   * Opens the add to playlist dialog with this song set to be added.
   */
  function addToPlaylist() {
    $songToAdd = song!.key;
    $showAddToPlaylist = true;
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    push(`/albums/${song!.album!}`);
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    push(`/artists/${song!.artist!}`);
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    push(`/songs/${song!.key}/edit`);
  }

  /**
   * Opens the platform's share ui.
   */
  function share() {
    AppController.share([song!.key]);
  }

  /**
   * Prompts the user to confirm if they want to delete this song.
   */
  function deleteSong() {
    AppController.deleteSongsFromDevice([song!.key]);
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
        <Button type="text" iconType="full" on:click={showSongEdit}>
          <Icon icon={Edit} width="20px" height="20px" />
        </Button>
        <div style="height: 100%; width: 5px;" />
        <MenuButton icon={MoreVert}>
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
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <DetailsArtPicture artPath={song?.artPath} />
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
</DetailsBody>

<style>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 40px;
  }

  .details {
    width: 100%;
  }
</style>