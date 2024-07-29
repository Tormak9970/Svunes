<script lang="ts">
  import { PlaybackController } from "@controllers";
  import { Favorites } from "@layout";
  import { t } from "@stores/Locale";
  import { playlists, showErrorSnackbar } from "@stores/State";
  import { hash64 } from "@utils";

  export let size = 146;

  /**
   * Handles when the user clicks on the entry.
   */
  function onClick() {
    const favorites = $playlists.find((playlist) => playlist.id === hash64("Favorites"))!;
    if (favorites.songIds.length === 0) {
      $showErrorSnackbar({ message: $t("NO_FAVORITES_MESSAGE") });
    } else {
      PlaybackController.playPlaylist(favorites);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" style="width: {size}px; height: {size}px;" on:click={onClick}>
  <Favorites width={50} height={50} />
</div>

<style>
  .container {
    border-radius: 10px;
    overflow: hidden;

    cursor: pointer;

    background-color: rgb(var(--m3-scheme-primary-container));
    color: rgb(var(--m3-scheme-primary));
  }
</style>