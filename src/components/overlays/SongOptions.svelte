<script lang="ts">
  import { Divider, Icon, ListItemButton } from "m3-svelte";
  import { AppController } from "../../lib/controllers/AppController";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import { showAddToPlaylist, showSongDetails, songToAdd, albumViewing, artistViewing, songToShowOptions, songViewing, showEditSong, showAlbumDetails, showSongOptions } from "../../stores/Overlays";
  import { songsMap } from "../../stores/State";
  import BottomSheet from "../layout/BottomSheet.svelte";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import AddBox from "@ktibow/iconset-material-symbols/add-box-rounded";
  import PlaylistAdd from "@ktibow/iconset-material-symbols/playlist-add-rounded";
  import Album from "@ktibow/iconset-material-symbols/album";
  import PlayNext from "@ktibow/iconset-material-symbols/resume-rounded";
  import Info from "@ktibow/iconset-material-symbols/info";
  import Artist from "@ktibow/iconset-material-symbols/artist-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-rounded";
  import Share from "@ktibow/iconset-material-symbols/share";
  import Trash from "@ktibow/iconset-material-symbols/delete-forever-rounded";

  $: song = $songToShowOptions ? $songsMap[$songToShowOptions] : null;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    $songToShowOptions = null;
    $showSongOptions = false;
  }

  /**
   * Plays this song.
   */
  function playSong() {
    PlaybackController.playSong(song!);
    closeOptions();
  }

  /**
   * Plays this song next.
   */
  function playNext() {
    QueueController.playNext([song!.title]);
    closeOptions();
  }

  /**
   * Queues this song.
   */
  function queueSong() {
    QueueController.queueSongs([song!.title]);
    closeOptions();
  }

  /**
   * Opens the add to playlist dialog with this song set to be added.
   */
  function addToPlaylist() {
    $songToAdd = song!.title;
    $showAddToPlaylist = true;
    closeOptions();
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    $albumViewing = song!.album;
    $showAlbumDetails = true;
    closeOptions();
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    $artistViewing = song!.artist;
    closeOptions();
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    $songViewing = song!.title;
    $showSongDetails = true;
    closeOptions();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    $songViewing = song!.title;
    $showEditSong = true;
    closeOptions();
  }

  /**
   * Opens the platform's share ui.
   */
  function share() {
    AppController.share([song!.title]);
    closeOptions();
  }

  /**
   * Prompts the user to confirm if they want to delete this song.
   */
  function deleteSong() {
    AppController.deleteFromDevice([song!.title]);
    closeOptions();
  }
</script>

{#if $showSongOptions}
  <BottomSheet on:close={closeOptions}>
    <div class="list">
      <ListItemButton headline="Play" on:click={playSong}>
        <svelte:fragment slot="leading">
          <Icon icon={Play} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Play Next" on:click={playNext}>
        <svelte:fragment slot="leading">
          <Icon icon={PlayNext} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Add to Queue" on:click={queueSong}>
        <svelte:fragment slot="leading">
          <Icon icon={AddBox} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Add to Playlist" on:click={addToPlaylist}>
        <svelte:fragment slot="leading">
          <Icon icon={PlaylistAdd} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Go to Album" on:click={goToAlbum}>
        <svelte:fragment slot="leading">
          <Icon icon={Album} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      {#if song?.artist}
        <ListItemButton headline="Go to Artist" on:click={goToArtist}>
          <svelte:fragment slot="leading">
            <Icon icon={Artist} />
          </svelte:fragment>
        </ListItemButton>
        <Divider />
      {/if}
      <ListItemButton headline="Details" on:click={showDetails}>
        <svelte:fragment slot="leading">
          <Icon icon={Info} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Edit" on:click={showSongEdit}>
        <svelte:fragment slot="leading">
          <Icon icon={Edit} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Share" on:click={share}>
        <svelte:fragment slot="leading">
          <Icon icon={Share} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Delete" on:click={deleteSong}>
        <svelte:fragment slot="leading">
          <Icon icon={Trash} />
        </svelte:fragment>
      </ListItemButton>
    </div>
    <div style="width: 100%; height: 20px;" />
  </BottomSheet>
{/if}

<style>
  .list {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
  }
</style>