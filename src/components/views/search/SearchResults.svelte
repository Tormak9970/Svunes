<script lang="ts">
  import SectionLabel from "@layout/SectionLabel.svelte";
  import type { Album, Artist, Genre, Playlist, Song } from "@models";
  import { t } from "@stores/Locale";
  import { searchQuery, selectedChips, showOnlyMissingAlbum, showOnlyMissingAlbumArtist, showOnlyMissingArtist, showOnlyMissingCover, showOnlyMissingGenre, showOnlyMissingTitle, showOnlyMissingYear } from "@stores/Search";
  import { albums, artists, genres, playlists, songs } from "@stores/State";
  import { derived } from "svelte/store";
  import AlbumListEntry from "../albums/AlbumListEntry.svelte";
  import ArtistListEntry from "../artists/ArtistListEntry.svelte";
  import GenreListEntry from "../genres/GenreListEntry.svelte";
  import PlaylistListEntry from "../playlists/PlaylistListEntry.svelte";
  import SongListEntry from "../songs/SongListEntry.svelte";
  import VirtualizedResults from "./VirtualizedResults.svelte";

  export let isScrolled = false;

  const searchResults = derived([
    selectedChips,
    songs,
    albums,
    artists,
    playlists,
    genres,
    searchQuery,
    showOnlyMissingTitle,
    showOnlyMissingCover,
    showOnlyMissingAlbum,
    showOnlyMissingArtist,
    showOnlyMissingAlbumArtist,
    showOnlyMissingGenre,
    showOnlyMissingYear
  ], ([$chips, $songs, $albums, $artists, $playlists, $genres, $query, $title, $cover, $album, $artist, $albumArtist, $genre, $year]) => {
    const queryValue = $query.toLowerCase();
    const results: (string | Song | Album | Artist | Playlist | Genre)[] = [];

    if ($query.length === 0 && !($title || $cover || $album || $artist || $albumArtist || $genre || $year)) return results;

    if (($chips.length === 0 || $chips.includes("song"))) {
      const songResults = $songs.filter((song) => {
        return (song.title ?? song.fileName).toLowerCase().includes(queryValue) &&
          (!$title || ($title && !song.title)) &&
          (!$cover || ($cover && !song.artPath)) &&
          (!$album || ($album && !song.album)) &&
          (!$artist || ($artist && !song.artist)) &&
          (!$albumArtist || ($albumArtist && song.albumArtist)) &&
          (!$genre || ($genre && !song.genre)) &&
          (!$year || ($year && song.releaseYear === -1));
      });
      if (songResults.length > 0) results.push($t("SONGS_TITLE"), ...songResults);
    }

    if (($chips.length === 0 || $chips.includes("album")) && !($title || $album || $artist)) {
      const albumResults = $albums.filter((album) => {
        return album.name.toLowerCase().includes(queryValue) &&
          (!$cover || ($cover && !album.artPath)) &&
          (!$albumArtist || ($albumArtist && album.albumArtist)) &&
          (!$genre || ($genre && !album.genre)) &&
          (!$year || ($year && album.releaseYear === -1));
      });
      if (albumResults.length > 0) results.push($t("ALBUMS_TITLE"), ...albumResults);
    }

    const onlyShowIsDisabled = !($title || $cover || $album || $artist || $albumArtist || $genre || $year);

    if (($chips.length === 0 || $chips.includes("artist")) && onlyShowIsDisabled) {
      const artistsResults = $artists.filter((artist) => artist.name.toLowerCase().includes(queryValue));
      if (artistsResults.length > 0) results.push($t("ARTISTS_TITLE"), ...artistsResults);
    }

    if (($chips.length === 0 || $chips.includes("playlist")) && onlyShowIsDisabled) {
      const playlistsResults = $playlists.filter((playlist) => playlist.name.toLowerCase().includes(queryValue));
      if (playlistsResults.length > 0) results.push($t("PLAYLISTS_TITLE"), ...playlistsResults);
    }
    
    if (($chips.length === 0 || $chips.includes("genre")) && onlyShowIsDisabled) {
      const genreResults = $genres.filter((genre) => genre.name.toLowerCase().includes(queryValue));
      if (genreResults.length > 0) results.push($t("GENRES_TITLE"), ...genreResults);
    }

    return results;
  });
</script>

<div class="inner-content">
  {#if $searchResults.length > 0}
    {#key $searchResults.length}
      <VirtualizedResults items={$searchResults} keyFunction={(entry) => entry.data.id ?? entry.data.name ?? entry.data} bind:isScrolled={isScrolled} let:entry>
        {#if typeof entry === "string"}
          <SectionLabel marginLeft="0.5rem" label={entry} />
        {:else if !!entry.fileName}
          <SongListEntry song={entry} detailType="Alphabetical" />
        {:else if !!entry.artists && !!entry.releaseYear}
          <AlbumListEntry album={entry} isSelectable={false} detailType="Alphabetical" />
        {:else if !!entry.albumNames}
          <ArtistListEntry artist={entry} isSelectable={false} />
        {:else if !!entry.dateCreated}
          <PlaylistListEntry playlist={entry} isSelectable={false} detailType="Alphabetical" />
        {:else}
          <GenreListEntry genre={entry} />
        {/if}
      </VirtualizedResults>
    {/key}
  {:else}
    <div class="message-container">
      <div class="font-label message">{$t("NO_SEARCH_RESULTS_MESSAGE")}</div>
    </div>
  {/if}
</div>

<style>
  .inner-content {
    width: 100%;

    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message-container {
    margin-top: 20%;
    color: rgb(var(--m3-scheme-on-secondary));
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message {
    max-width: 300px;
    text-align: center;
  }
</style>