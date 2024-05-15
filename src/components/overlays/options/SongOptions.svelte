<script lang="ts">
  import { Divider, Icon, ListItemButton } from "m3-svelte";
  import { AppController } from "../../../lib/controllers/AppController";
  import { PlaybackController } from "../../../lib/controllers/PlaybackController";
  import { QueueController } from "../../../lib/controllers/QueueController";
  import { showAddToPlaylist, showSongDetails, songToAdd, albumViewing, artistViewing, songViewing, showEditSong, showAlbumDetails, showSongOptions } from "../../../stores/Overlays";
  import { songsMap } from "../../../stores/State";
  import BottomSheet from "../../layout/BottomSheet.svelte";
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
  import type { Song } from "../../../lib/models/Song";

  $: song = ($songViewing ? $songsMap[$songViewing] : null) as Song;

  function closeOptions() {
    $songViewing = null;
    $showSongOptions = false;
  }

  function addToPlaylist() {
    $songToAdd = song!.title;
    $showAddToPlaylist = true;
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    $albumViewing = song!.album;
    $showAlbumDetails = true;
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    $artistViewing = song!.artist;
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    $showSongDetails = true;
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    $showEditSong = true;
  }
</script>

{#if $showSongOptions}
  <BottomSheet on:close={closeOptions}>
    <div class="list">
      <ListItemButton headline="Play" on:click={() => PlaybackController.playSong(song)}>
        <svelte:fragment slot="leading">
          <Icon icon={Play} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Play Next" on:click={() => QueueController.playNext([song.title])}>
        <svelte:fragment slot="leading">
          <Icon icon={PlayNext} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Add to Queue" on:click={() => QueueController.queueSongs([song.title])}>
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
      <ListItemButton headline="Share" on:click={() => AppController.share([song.title])}>
        <svelte:fragment slot="leading">
          <Icon icon={Share} />
        </svelte:fragment>
      </ListItemButton>
      <Divider />
      <ListItemButton headline="Delete" on:click={() => AppController.deleteFromDevice([song.title])}>
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