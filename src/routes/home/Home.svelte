<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import HomeHeader from "@views/home/HomeHeader.svelte";
  import Suggestions from "@views/home/Suggestions.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
  
  import Icon from "@component-utils/Icon.svelte";

  import CalendarAddOn from "@ktibow/iconset-material-symbols/calendar-add-on-rounded";
  import History from "@ktibow/iconset-material-symbols/history-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import TrendingUp from "@ktibow/iconset-material-symbols/trending-up-rounded";
  
  import AlbumCarousel from "@layout/album-carousel/AlbumCarousel.svelte";
  import ArtistCarousel from "@layout/artist-carousel/ArtistCarousel.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import { QueueController } from "@lib/controllers/QueueController";
  import type { Album } from "@lib/models/Album";
  import type { Artist } from "@lib/models/Artist";
  import { shuffleSongs } from "@lib/utils/Shuffle";
  import { getAllArtistNames } from "@lib/utils/Utils";
  import { albumsMap, artistsMap, showSuggestions, songs, songsMap } from "@stores/State";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  let artists: Artist[] = [];
  let albums: Album[] = [];

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
    <HomeHeader highlight={false} />
  </div>
  <div slot="content" class="content">
    <div class="buttons-container" style:--m3-button-shape="10px" style:--m3-scheme-secondary-container="var(--m3-scheme-surface-container)">
      <Button type="tonal" iconType="left" on:click={() => push("/home/history")}>
        <Icon icon={History} />
        History
      </Button>
      <Button type="tonal" iconType="left" on:click={() => push("/home/recently-added")}>
        <Icon icon={CalendarAddOn} />
        Recently Added
      </Button>
      <Button type="tonal" iconType="left" on:click={() => push("/home/most-played")}>
        <Icon icon={TrendingUp} />
        Most Played
      </Button>
      <Button type="tonal" iconType="left" on:click={shuffleAllSongs}>
        <Icon icon={Shuffle} />
        Shuffle
      </Button>
    </div>
    {#if $showSuggestions}
      <Suggestions />
    {/if}
    <ArtistCarousel label="Top Artists" artists={artists} on:click={() => push("/home/top-artists")} />
    <AlbumCarousel label="Top Albums" albums={albums} on:click={() => push("/home/top-albums")} />
  </div>
</ViewContainer>

<style>
  .content {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
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