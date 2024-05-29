<script lang="ts">
  import { LogController } from "../../lib/controllers/LogController";
  import { Playlist } from "../../lib/models/Playlist";
  import { showCreatePlaylist, songsForNewPlaylist } from "../../stores/Overlays";
  import { playlists, playlistsMap, showErrorSnackbar, showInfoSnackbar } from "../../stores/State";
  import Button from "../interactables/Button.svelte";
  import TextField from "../interactables/TextField.svelte";
  import BottomSheet from "../layout/BottomSheet.svelte";
  let newPlaylistName = "";

  /**
   * Creates a new playlist
   */
  function createPlaylist() {
    if ($playlistsMap[newPlaylistName]) {
      $showErrorSnackbar({ message: "Playlist with that name already exists", timeout: 2000 });
      return;
    }

    const playlist = new Playlist(false, newPlaylistName, "", [ ...$songsForNewPlaylist ], true);
    $playlists = [ ...$playlists, playlist ];

    $songsForNewPlaylist = [];
    $showCreatePlaylist = false;
    LogController.log(`Created playlist ${newPlaylistName}.`);
    $showInfoSnackbar({ message: "Playlist created", timeout: 1500 });
  }

  /**
   * Closes the overlay.
   */
  function close() {
    $showCreatePlaylist = false;
  }
</script>

{#if $showCreatePlaylist}
  <BottomSheet on:close={close}>
    <div class="content" style:--m3-util-background={"var(--m3-scheme-surface-container-low)"}>
      <div class="message">Give your playlist a name</div>
      <TextField name="Playlist Name" bind:value={newPlaylistName} extraWrapperOptions={{ style: "width: 80%; margin-bottom: 20px;" }} />
      <Button type="tonal" disabled={newPlaylistName === ""} on:click={createPlaylist}>Create</Button>
    </div>
  </BottomSheet>
{/if}

<style>
  .content {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    padding-top: 40px;
    padding-bottom: 400px;
  }

  .message {
    margin-bottom: 40px;
  }
</style>