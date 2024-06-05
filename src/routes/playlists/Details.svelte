<script lang="ts">
  import Button from "../../components/interactables/Button.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { isPaused, nowPlayingList, playlistsMap } from "../../stores/State";
  import { playlistToAdd, showAddToPlaylist } from "../../stores/Overlays";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import DetailsBody from "../../components/utils/DetailsBody.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import MenuButton from "../../components/interactables/MenuButton.svelte";
  import { pop, push } from "svelte-spa-router";
  import PlaylistSongs from "./PlaylistSongs.svelte";
  import MenuItem from "../../components/layout/MenuItem.svelte";
  import PlaylistImage from "../../components/views/playlists/PlaylistImage.svelte";
  import ToggleShuffleButton from "../../components/views/utils/ToggleShuffleButton.svelte";
  import PlayButton from "../../components/views/utils/PlayButton.svelte";
  import Marquee from "../../components/layout/Marquee.svelte";
  import { EditController } from "../../lib/controllers/EditController";

  export let params: { id?: string } = {};
  $: playlist = params.id ? $playlistsMap[params.id!] : undefined;

  let imageSize = 370;
  let isAtTop = true;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }

  /**
   * Plays this playlist.
   */
  function playPlaylist() {
    if ($nowPlayingList === playlist!.id) {
      if (!$isPaused) {
        PlaybackController.pause();
      } else {
        PlaybackController.resume();
      }
    } else {
      PlaybackController.playPlaylist(playlist!);
    }
  }

  /**
   * Plays this playlist next.
   */
  function playNext() {
    QueueController.playPlaylistsNext([playlist!.id]);
  }

  /**
   * Queues this playlist.
   */
  function queuePlaylist() {
    QueueController.queuePlaylists([playlist!.id]);
  }

  /**
   * Opens the add to playlist dialog with this playlist set to be added.
   */
  function addToPlaylist() {
    $playlistToAdd = playlist!.id;
    $showAddToPlaylist = true;
  }

  /**
   * Shows the edit playlist overlay.
   */
  function showPlaylistEdit() {
    push(`/playlists/${params.id}/edit`);
  }

  /**
   * Prompts the user to confirm if they want to delete this playlist.
   */
  function deletePlaylist() {
    EditController.deletePlaylistsFromDevice([playlist!.id]);
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
        {#if playlist?.isUserPlaylist}
          <Button type="text" iconType="full" on:click={showPlaylistEdit}>
            <Icon icon={Edit} width="20px" height="20px" />
          </Button>
        {/if}
        <div style="height: 100%; width: 5px;" />
        <MenuButton icon={MoreVert}>
          <MenuItem on:click={playNext}>Play Next</MenuItem>
          <MenuItem on:click={queuePlaylist}>Add to Queue</MenuItem>
          <MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
          {#if playlist?.isUserPlaylist}
            <MenuItem on:click={deletePlaylist}>Delete</MenuItem>
          {/if}
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    {#if playlist}
      <PlaylistImage playlist={playlist} height={imageSize} width={imageSize} />
      <div class="details">
        <div class="info">
          <Marquee pauseOnHover speed={50} gap={100}>
            <h3 class="name">{playlist?.name}</h3>
          </Marquee>
          <div class="other">
            <div>{playlist?.songIds?.length === 1 ? `1 Song` : `${playlist?.songIds?.length} Songs`} • {playlist?.displayLength()}</div>
          </div>
        </div>
        <div class="buttons">
          <ToggleShuffleButton />
          <PlayButton name={playlist?.id} on:click={playPlaylist} />
        </div>
      </div>
      <div class="songs" style="margin-top: 5px;">
        {#if playlist}
          <PlaylistSongs playlist={playlist} />
        {/if}
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

  .buttons {
    display: flex;
    align-items: center;

    gap: 10px;
  }

  .details {
    width: calc(100% - 30px);
    margin: 0px 15px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .songs {
    width: 100%;
  }
</style>