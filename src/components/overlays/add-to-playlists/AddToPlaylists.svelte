<script lang="ts">
  import { LogController } from "@controllers";
  import { Button } from "@interactables";
  import BottomSheet from "@layout/BottomSheet.svelte";
  import { t } from "@stores/Locale";
  import { albumToAdd, artistToAdd, genreToAdd, playlistToAdd, showAddToPlaylist, showCreatePlaylist, songToAdd, songsForNewPlaylist } from "@stores/Overlays";
  import { selected } from "@stores/Select";
  import { albumsMap, artistsMap, genresMap, playlists, playlistsMap, selectedView, showInfoSnackbar } from "@stores/State";
  import { View } from "@types";
  import { afterUpdate } from "svelte";
  import { location } from "svelte-spa-router";
  import { fade } from "svelte/transition";
  import PlaylistEntry from "./PlaylistEntry.svelte";
  
  let scrollContainer: HTMLDivElement;
  let selectedPlaylists: string[] = [];

  $: playlistToRender = $location.startsWith("/playlists") ? $playlists.filter((playlist) => playlist.name !== $playlistToAdd && !$selected.includes(playlist.name)) : $playlists;
  let showShadow = true;

  function handleScroll() {
    showShadow = scrollContainer.clientHeight !== scrollContainer.scrollHeight && scrollContainer?.scrollHeight - scrollContainer?.scrollTop !== scrollContainer.clientHeight;
  }

  /**
   * Gets the song ids from the current selection.
   */
  function getSongsFromSelected(): string[] {
    let songIds: string[] = [];

    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          for (const playlistId of $selected) {
            const playlist = $playlistsMap[playlistId];
            songIds.push(...playlist.songIds);
          }
        } else {
          songIds = $selected;
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          for (const albumName of $selected) {
            const album = $albumsMap[albumName];
            songIds.push(...album.songIds);
          }
        } else {
          songIds = $selected;
        }
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          for (const artistName of $selected) {
            const artist = $artistsMap[artistName];
            songIds.push(...artist.songIds);
          }
        } else {
          songIds = $selected;
        }
        break;
      }
      case View.SONGS:
      case View.GENRES: {
        songIds = $selected;
        break;
      }
      case View.HOME:
      case View.SEARCH:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }

    return songIds;
  }

  /**
   * Gets the song ids from the selected type.
   */
  function getSongs(): string[] {
    if ($selected.length > 0) {
      return getSongsFromSelected();
    } else if ($songToAdd) {
      return [ $songToAdd ];
    } else if ($playlistToAdd) {
      return $playlistsMap[$playlistToAdd].songIds;
    } else if ($albumToAdd) {
      return $albumsMap[$albumToAdd].songIds;
    } else if ($artistToAdd) {
      return $artistsMap[$artistToAdd].songIds;
    } else if ($genreToAdd) {
      return $genresMap[$genreToAdd].songIds;
    } else {
      LogController.error("Shouldn't be able to get here!");
      return [];
    }
  }

  /**
   * Adds the selection to the selected playlists.
   */
  function addToSelected() {
    const songs = getSongs();

    for (const playlistId of selectedPlaylists) {
      const playlist = $playlistsMap[playlistId];

      for (const id of songs) {
        if (!playlist.songIds.includes(id)) playlist.songIds.push(id);
      }
    }

    $playlists = [ ...$playlists ];
    
    close();

    if (selectedPlaylists.length > 0) {
      const numAddedMessage = `${songs.length} ${$t(songs.length === 1 ? "SONG_SINGULAR_VALUE" : "SONG_PLURAL_VALUE")}`;
      $showInfoSnackbar({ message: `${$t("ADDED_VALUE")} ${numAddedMessage}` });
      LogController.log(`Added ${songs.length} songs to playlist.`);
    }
  }

  /**
   * Opens the create new playlist overlay with the needed data set.
   */
  function setCreateNewPlaylist() {
    $songsForNewPlaylist = getSongs();
    $showCreatePlaylist = true;
    close();
  }

  function togglePlaylistInclude(playlistId: string) {
    const index = selectedPlaylists.indexOf(playlistId);

    if (index !== -1) {
      selectedPlaylists.splice(index, 1);
    } else {
      selectedPlaylists.push(playlistId);
    }
  }

  /**
   * Closes the overlay.
   */
  function close() {
    $showAddToPlaylist = false;
    $songToAdd = null;
    $albumToAdd = null;
    $genreToAdd = null;
    $artistToAdd = null;
    $playlistToAdd = null;
    $selected = [];
  }

  afterUpdate(() => {
    if ($showAddToPlaylist) {
      showShadow = scrollContainer.clientHeight !== scrollContainer.scrollHeight && scrollContainer?.scrollHeight - scrollContainer?.scrollTop !== scrollContainer.clientHeight;
    }
  });
</script>

<BottomSheet on:close={close} padding="0 0.5rem">
  <div class="content-wrapper styled-scrollbar" bind:this={scrollContainer} on:scroll={handleScroll}>
    <div class="content">
      <Button type="tonal" on:click={setCreateNewPlaylist}>{$t("NEW_PLAYLIST_ACTION")}</Button>
      <div class="playlists">
        {#each playlistToRender as playlist}
          <PlaylistEntry playlist={playlist} checked={false} on:click={() => togglePlaylistInclude(playlist.id)} />
        {/each}
      </div>
    </div>
    <div class="done-container">
      <Button type="filled" on:click={addToSelected}>{$t("DONE_ACTION")}</Button>
    </div>
    {#if showShadow}
      <div class="shadow" in:fade={{ duration: 200 }} />
    {/if}
  </div>
</BottomSheet>

<style>
  .content-wrapper {
    width: 100%;
    height: 80vh;
    overflow-y: scroll;
    overflow-x: hidden;

    position: relative;
  }

  .content {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    padding-top: 20px;
    padding-bottom: 100px;
  }

  .playlists {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .done-container {
    position: fixed;
    bottom: 40px;
    left: 50%;
    translate: -50% 0%;
  }

  .shadow {
    position: fixed;
    pointer-events: none;

    bottom: 0;
    left: -0.5rem;

    width: calc(100% + 1rem);
    height: 40px;
    background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(var(--m3-scheme-surface-container-low)) 100%);
  }
</style>