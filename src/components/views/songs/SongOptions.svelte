<script lang="ts">
  import MenuItem from "@layout/MenuItem.svelte";
  import { AppController } from "@lib/controllers/AppController";
  import { EditController } from "@lib/controllers/EditController";
  import { QueueController } from "@lib/controllers/QueueController";
  import type { Song } from "@models";
  import { t } from "@stores/Locale";
  import { showAddToPlaylist, songToAdd } from "@stores/Overlays";
  import { playlists, playlistsMap, songIdsToParse } from "@stores/State";
  import { goToSongDetails, goToSongEdit } from "@utils";
  import { location, push, replace } from "svelte-spa-router";

  export let menuIsOpen: boolean;
  export let song: Song;
  export let hideEditOption = false;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }

  /**
   * Removes this song from the current playlist.
   */
  function removeFromPlaylist() {
    const id = $location.slice(11);
    const playlist = $playlistsMap[id];

    playlist.removeSong(song.id);
    
    $playlists = [ ...$playlists ];
    closeOptions();
  }

  /**
   * Plays this song next.
   */
  function playNext() {
    QueueController.playSongsNext([song!.id]);
    closeOptions();
  }

  /**
   * Queues this song.
   */
  function queueSong() {
    QueueController.queueSongs([song!.id]);
    closeOptions();
  }

  /**
   * Opens the add to playlist dialog with this song set to be added.
   */
  function addToPlaylist() {
    $songToAdd = song!.id;
    $showAddToPlaylist = true;
    closeOptions();
  }

  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    push(`/albums/${song!.album!}`);
    closeOptions();
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    push(`/artists/${song!.artist!}`);
    closeOptions();
  }

  /**
   * Shows the song details overlay.
   */
  function showDetails() {
    goToSongDetails(song!.id);
    closeOptions();
  }

  /**
   * Shows the edit song overlay.
   */
  function showSongEdit() {
    goToSongEdit(song!.id);
    closeOptions();
  }

  /**
   * Opens the platform's share ui.
   */
  function share() {
    AppController.share([song!.id]);
    closeOptions();
  }

  /**
   * Shows the metadata parser.
   */
  function showInfoParser() {
    menuIsOpen = false;
    $songIdsToParse = [ song.id ];
    push("/metadata-parser");
  }

  /**
   * Prompts the user to confirm if they want to delete this song.
   */
  function deleteSong() {
    EditController.deleteSongsFromDevice([song!.id]);
    closeOptions();
    if ($location.startsWith("/songs/")) replace("/songs");
  }
</script>

{#if $location.startsWith("/playlists")}
<MenuItem on:click={removeFromPlaylist}>Remove from Playlist</MenuItem>
{/if}
<MenuItem on:click={playNext}>{$t("PLAY_NEXT_ACTION")}</MenuItem>
<MenuItem on:click={queueSong}>{$t("ADD_TO_QUEUE_ACTION")}</MenuItem>
<MenuItem on:click={addToPlaylist}>{$t("ADD_TO_PLAYLISTS_ACTION")}</MenuItem>
{#if song?.album}
  <MenuItem on:click={goToAlbum}>{$t("GO_TO_ALBUM_ACTION")}</MenuItem>
{/if}
{#if song?.artist}
  <MenuItem on:click={goToArtist}>{$t("GO_TO_ARTIST_ACTION")}</MenuItem>
{/if}
<MenuItem on:click={showDetails}>{$t("DETAILS_ACTION")}</MenuItem>
{#if !hideEditOption}
<MenuItem on:click={showSongEdit}>{$t("EDIT_ACTION")}</MenuItem>
{/if}
<MenuItem on:click={showInfoParser}>{$t("INFO_PARSER_ACTION")}</MenuItem>
<MenuItem on:click={share}>{$t("SHARE_ACTION")}</MenuItem>
<MenuItem on:click={deleteSong}>{$t("DELETE_ACTION")}</MenuItem>