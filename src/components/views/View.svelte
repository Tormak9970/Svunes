<script lang="ts">
  import { fade } from "svelte/transition";
  import { View } from "../../types/View";
  import { selectedView } from "../../stores/State";
  import PlaylistsView from "./playlists/PlaylistsView.svelte";
  import AlbumsView from "./albums/AlbumsView.svelte";
  import SongsView from "./songs/SongsView.svelte";
  import GenresView from "./genres/GenresView.svelte";
  import ArtistsView from "./artists/ArtistsView.svelte";
  import SettingsView from "./settings/SettingsView.svelte";
  import SearchView from "./search/SearchView.svelte";
  import HomeView from "./home/HomeView.svelte";

  const views = {
    playlists: View.PLAYLISTS,
    albumns: View.ALBUMS,
    songs: View.SONGS,
    genres: View.GENRES,
    artists: View.ARTISTS,
    settings: View.SETTINGS,
    home: View.HOME,
    search: View.SEARCH
  }
</script>

<div class="view" in:fade>
  {#if $selectedView === views.playlists}
    <PlaylistsView />
  {:else if $selectedView === views.albumns}
    <AlbumsView />
  {:else if $selectedView === views.songs}
    <SongsView />
  {:else if $selectedView === views.genres}
    <GenresView />
  {:else if $selectedView === views.artists}
    <ArtistsView />
  {:else if $selectedView === views.settings}
    <SettingsView />
  {:else if $selectedView === views.search}
    <SearchView />
  {:else if $selectedView === views.home}
    <HomeView />
  {/if}
</div>

<style>
  .view {
    width: 100%;
    height: 100%;
  }
</style>