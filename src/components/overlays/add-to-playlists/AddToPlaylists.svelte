<script lang="ts">
  import { location } from "svelte-spa-router";
  import { LogController } from "../../../lib/controllers/utils/LogController";
  import { albumToAdd, artistToAdd, genreToAdd, playlistToAdd, showAddToPlaylist, showCreatePlaylist, songToAdd, songsForNewPlaylist } from "../../../stores/Overlays";
  import { selected } from "../../../stores/Select";
  import { albumsMap, artistsMap, genresMap, playlists, playlistsMap, selectedView, showInfoSnackbar } from "../../../stores/State";
  import { View } from "../../../types/View";
  import Button from "../../interactables/Button.svelte";
  import BottomSheet from "../../layout/BottomSheet.svelte";
  import PlaylistEntry from "./PlaylistEntry.svelte";
  import { fade } from "svelte/transition";
  import { afterUpdate } from "svelte";
  
  let scrollContainer: HTMLDivElement;
  let selectedPlaylists: string[] = [];

  $: playlistToRender = $playlistToAdd ? $playlists.filter((playlist) => playlist.name !== $playlistToAdd) : $playlists;
  let showShadow = true;

  function handleScroll() {
    showShadow = scrollContainer.clientHeight !== scrollContainer.scrollHeight && scrollContainer?.scrollHeight - scrollContainer?.scrollTop !== scrollContainer.clientHeight;
  }

  /**
   * Gets the song keys from the current selection.
   */
  function getSongsFromSelected(): string[] {
    let songNames: string[] = [];

    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          for (const playlistName of $selected) {
            const playlist = $playlistsMap[playlistName];
            songNames.push(...playlist.songKeys);
          }
        } else {
          songNames = $selected;
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          for (const albumName of $selected) {
            const album = $albumsMap[albumName];
            songNames.push(...album.songKeys);
          }
        } else {
          songNames = $selected;
        }
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          for (const artistName of $selected) {
            const artist = $artistsMap[artistName];
            songNames.push(...artist.songKeys);
          }
        } else {
          songNames = $selected;
        }
        break;
      }
      case View.SONGS:
      case View.GENRES: {
        songNames = $selected;
        break;
      }
      case View.HOME:
      case View.SEARCH:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }

    return songNames;
  }

  /**
   * Gets the song keys from the selected type.
   */
  function getSongs(): string[] {
    if ($selected.length > 0) {
      return getSongsFromSelected();
    } else if ($songToAdd) {
      return [ $songToAdd ];
    } else if ($playlistToAdd) {
      return $playlistsMap[$playlistToAdd].songKeys;
    } else if ($albumToAdd) {
      return $albumsMap[$albumToAdd].songKeys;
    } else if ($artistToAdd) {
      return $artistsMap[$artistToAdd].songKeys;
    } else if ($genreToAdd) {
      return $genresMap[$genreToAdd].songKeys;
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

    for (const playlistName of selectedPlaylists) {
      const playlist = $playlistsMap[playlistName];

      for (const songKey of songs) {
        if (!playlist.songKeys.includes(songKey)) playlist.songKeys.push(songKey);
      }
    }

    $playlists = [ ...$playlists ];
    
    close();

    if (selectedPlaylists.length > 0) {
      const numAddedMessage = `${songs.length} ${songs.length === 1 ? "song" : "songs"}`;
      $showInfoSnackbar({ message: `Added ${numAddedMessage}` });
      LogController.log(`Added ${numAddedMessage}.`);
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

  function togglePlaylistInclude(playlistName: string) {
    const index = selectedPlaylists.indexOf(playlistName);

    if (index !== -1) {
      selectedPlaylists.splice(index, 1);
    } else {
      selectedPlaylists.push(playlistName);
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

{#if $showAddToPlaylist}
  <BottomSheet on:close={close} padding="0 0.5rem">
    <div class="content-wrapper" bind:this={scrollContainer} on:scroll={handleScroll}>
      <div class="content">
        <Button type="tonal" on:click={setCreateNewPlaylist}>New Playlist</Button>
        <div class="playlists">
          {#each playlistToRender as playlist}
            <PlaylistEntry playlist={playlist} checked={false} on:click={() => togglePlaylistInclude(playlist.name)} />
          {/each}
        </div>
      </div>
      <div class="done-container">
        <Button type="filled" on:click={addToSelected}>Done</Button>
      </div>
      {#if showShadow}
        <div class="shadow" in:fade={{ duration: 200 }} />
      {/if}
    </div>
  </BottomSheet>
{/if}

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