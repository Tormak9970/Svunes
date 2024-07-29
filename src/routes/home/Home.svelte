<script lang="ts">
  import { Icon, ViewContainer } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import Suggestions from "@views/home/Suggestions.svelte";

  import CalendarAddOn from "@ktibow/iconset-material-symbols/calendar-add-on-rounded";
  import History from "@ktibow/iconset-material-symbols/history-rounded";
  import Search from "@ktibow/iconset-material-symbols/search";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import TrendingUp from "@ktibow/iconset-material-symbols/trending-up-rounded";
  
  import { PlaybackController, QueueController } from "@controllers";
  import { isScrolled } from "@directives";
  import AlbumCarousel from "@layout/album-carousel/AlbumCarousel.svelte";
  import ArtistCarousel from "@layout/artist-carousel/ArtistCarousel.svelte";
  import ViewHeader from "@layout/ViewHeader.svelte";
  import type { Album, Artist } from "@models";
  import { t } from "@stores/Locale";
  import { selectedChips } from "@stores/Search";
  import { albumsMap, artistsMap, lastView, selectedView, showSuggestions, songs, songsMap } from "@stores/State";
  import { View } from "@types";
  import { getAllArtistNames, shuffleSongs } from "@utils";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  let highlight = false;

  let artists: Artist[] = [];
  let albums: Album[] = [];
  
  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $lastView = $selectedView;
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $lastView = $selectedView;
    $selectedView = View.SEARCH;
    $selectedChips = [];
    push("/search");
  }

  function shuffleAllSongs() {
    const shuffled = shuffleSongs(Object.keys($songsMap));
    const first = $songsMap[shuffled[0]];
    PlaybackController.playSong(first);
    QueueController.queueSongs(shuffled.slice(1));
  }

  onMount(() => {
    const artistNames: string[] = [];
    const albumNames: string[] = [];

    const sorted = $songs.sort((a, b) => a.numTimesPlayed - b.numTimesPlayed);

    for (const song of sorted) {
      if (song.albumArtist && artistNames.length < 10) {
        const artists = getAllArtistNames(song.albumArtist);
        if (!artistNames.includes(artists[0])) artistNames.push(artists[0]);
      }

      if (song.album && albumNames.length < 10 && !albumNames.includes(song.album)) albumNames.push(song.album);

      if (artistNames.length === 10 && albumNames.length === 10) break;
    }

    artists = artistNames.map((name) => $artistsMap[name]);
    albums = albumNames.map((name) => $albumsMap[name]);
  });
</script>

<ViewContainer>
  <div slot="header">
    <ViewHeader title="Tunistic" highlight={highlight}>
      <div slot="left">
        <!-- svelte-ignore missing-declaration -->
        {#if IS_MOBILE}
          <Button type="text" iconType="full" on:click={openSearch}>
            <Icon icon={Search} width="20px" height="20px" />
          </Button>
        {/if}
      </div>
      <div slot="right">
        <!-- svelte-ignore missing-declaration -->
        {#if IS_MOBILE}
          <Button type="text" iconType="full" on:click={goToSettings}>
            <Icon icon={Settings} width="20px" height="20px" />
          </Button>
        {/if}
      </div>
    </ViewHeader>
  </div>
  <div slot="content" class="content styled-scrollbar" style="overflow-y: scroll;" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
    <div class="inner-content">
      <div class="buttons-container" style:--m3-button-shape="10px" style:--m3-scheme-secondary-container="var(--m3-scheme-surface-container)">
        <Button type="tonal" iconType="left" on:click={() => push("/home/history")}>
          <Icon icon={History} />
          {$t("HISTORY_TITLE")}
        </Button>
        <Button type="tonal" iconType="left" on:click={() => push("/home/recently-added")}>
          <Icon icon={CalendarAddOn} />
          {$t("RECENTLY_ADDED_TITLE")}
        </Button>
        <Button type="tonal" iconType="left" on:click={() => push("/home/most-played")}>
          <Icon icon={TrendingUp} />
          {$t("MOST_PLAYED_TITLE")}
        </Button>
        <Button type="tonal" iconType="left" on:click={shuffleAllSongs}>
          <Icon icon={Shuffle} />
          {$t("SHUFFLE_TITLE")}
        </Button>
      </div>
      <!-- svelte-ignore missing-declaration -->
      {#if $showSuggestions && IS_MOBILE}
        <Suggestions />
      {/if}
      <ArtistCarousel label={$t("TOP_ARTISTS_TITLE")} artists={artists} on:click={() => push("/home/top-artists")} />
      <AlbumCarousel label={$t("TOP_ALBUMS_TITLE")} albums={albums} on:click={() => push("/home/top-albums")} />
    </div>
  </div>
</ViewContainer>

<style>
  .content {
    width: 100%;
    height: 100%;
  }
  .inner-content {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding-bottom: 70px;
  }
  .buttons-container {
    width: calc(100% - 2rem);
    padding: 0rem 1rem;

    margin-top: 1rem;

    display: grid;
    grid-template-columns: 1fr 1fr;

    gap: 15px;
  }

  .buttons-container :global(.m3-container) {
    justify-content: flex-start;
  }
  .buttons-container :global(svg) {
    color: rgb(var(--m3-scheme-primary));
  }
</style>