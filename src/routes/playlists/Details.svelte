<script lang="ts">
  import { DetailsBody, Icon, OverlayHeader } from "@component-utils";
  import { EditController, PlaybackController, QueueController } from "@controllers";
  import { isScrolled } from "@directives";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import PlayButton from "@interactables/PlayButton.svelte";
  import ToggleShuffleButton from "@interactables/ToggleShuffleButton.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import Edit from "@ktibow/iconset-material-symbols/edit-outline-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Marquee from "@layout/Marquee.svelte";
  import MenuItem from "@layout/MenuItem.svelte";
  import { t } from "@stores/Locale";
  import { playlistToAdd, showAddToPlaylist } from "@stores/Overlays";
  import { isPaused, nowPlayingList, playlistsMap } from "@stores/State";
  import PlaylistImage from "@views/playlists/PlaylistImage.svelte";
  import { pop, push } from "svelte-spa-router";
  import PlaylistSongs from "./PlaylistSongs.svelte";

  export let params: { id?: string } = {};
  $: playlist = params.id ? $playlistsMap[params.id!] : undefined;

  let imageSize = 370;
  let highlight = false;

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

<DetailsBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
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
          <MenuItem on:click={playNext}>{$t("PLAY_NEXT_ACTION")}</MenuItem>
          <MenuItem on:click={queuePlaylist}>{$t("ADD_TO_QUEUE_ACTION")}</MenuItem>
          <MenuItem on:click={addToPlaylist}>{$t("ADD_TO_PLAYLIST_ACTION")}</MenuItem>
          {#if playlist?.isUserPlaylist}
            <MenuItem on:click={deletePlaylist}>{$t("DELETE_ACTION")}</MenuItem>
          {/if}
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content styled-scrollbar" slot="content" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
    <div class="content-inner">
      {#if playlist}
        <PlaylistImage playlist={playlist} height={imageSize} width={imageSize} />
        <div class="details">
          <div class="info">
            <Marquee speed={50} gap={100}>
              <h3 class="name">{playlist?.name}</h3>
            </Marquee>
            <div class="font-body other">
              <div>{playlist?.songIds?.length} {playlist?.songIds?.length === 1 ? $t("SONG_SINGULAR_VALUE") : $t("SONG_PLURAL_VALUE")} • {playlist?.displayLength()}</div>
            </div>
          </div>
          <div class="buttons">
            <ToggleShuffleButton />
            <PlayButton name={playlist?.id} on:click={playPlaylist} />
          </div>
        </div>
        <div class="songs" style="margin-top: 5px;">
          <PlaylistSongs playlistId={playlist.id} />
        </div>
      {/if}
      <div style="width: 100%; height: 70px;" />
    </div>
  </span>
</DetailsBody>

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