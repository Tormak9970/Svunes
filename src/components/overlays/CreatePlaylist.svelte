<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import TextField from "@interactables/TextField.svelte";
  import BottomSheet from "@layout/BottomSheet.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import { Playlist } from "@lib/models/Playlist";
  import t from "@lib/utils/i18n";
  import { hash64 } from "@lib/utils/Utils";
  import { showCreatePlaylist, songsForNewPlaylist } from "@stores/Overlays";
  import { playlists, playlistsMap, showErrorSnackbar, showInfoSnackbar } from "@stores/State";

  let newPlaylistName = "";

  /**
   * Creates a new playlist
   */
  function createPlaylist() {
    if ($playlistsMap[hash64(newPlaylistName)]) {
      $showErrorSnackbar({ message: t("PLAYLIST_EXISTS_MESSAGE"), faster: true });
      return;
    }

    const playlist = new Playlist(undefined, false, newPlaylistName, "", [ ...$songsForNewPlaylist ], true);
    $playlists = [ ...$playlists, playlist ];

    $songsForNewPlaylist = [];
    LogController.log(`Created playlist ${newPlaylistName}.`);
    $showInfoSnackbar({ message: t("PLAYLIST_CREATED_MESSAGE") });

    close();
  }

  /**
   * Closes the overlay.
   */
  function close() {
    $showCreatePlaylist = false;
    newPlaylistName = ""
  }
</script>

<BottomSheet on:close={close}>
  <div class="content" style:--m3-util-background="var(--m3-scheme-surface-container-low)">
    <div class="message">{t("NAME_PLAYLIST_TITLE")}</div>
    <TextField name="Playlist Name" bind:value={newPlaylistName} extraWrapperOptions={{ style: "width: 80%; margin-bottom: 20px;" }} />
    <Button type="tonal" disabled={newPlaylistName === ""} on:click={createPlaylist}>{t("CREATE_ACTION")}</Button>
  </div>
</BottomSheet>

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