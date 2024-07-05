<script lang="ts">
  import type { Album } from "@lib/models/Album";
  import type { Artist } from "@lib/models/Artist";
  import type { Genre } from "@lib/models/Genre";
  import type { Playlist } from "@lib/models/Playlist";
  import type { Song } from "@lib/models/Song";
  import { searchQuery, selectedChips, showOnlyMissingAlbum, showOnlyMissingAlbumArtist, showOnlyMissingArtist, showOnlyMissingCover, showOnlyMissingGenre, showOnlyMissingTitle, showOnlyMissingYear } from "@stores/Search";
  import { albums, artists, genres, playlists, songs } from "@stores/State";
  import { derived } from "svelte/store";
  import AlbumListEntry from "../albums/ListEntry.svelte";
  import ArtistListEntry from "../artists/ListEntry.svelte";
  import GenreListEntry from "../genres/ListEntry.svelte";
  import PlaylistListEntry from "../playlists/ListEntry.svelte";
  import SongListEntry from "../songs/ListEntry.svelte";
  import SearchSection from "./SearchSection.svelte";
  import VirtualizedResults from "./VirtualizedResults.svelte";

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
    const results: (string | Song | Album | Artist | Playlist | Genre)[] = [];

    if ($query.length === 0 && !($title || $cover || $album || $artist || $albumArtist || $genre || $year)) return results;

    if (($chips.length === 0 || $chips.includes("song"))) {
      const songResults = $songs.filter((song) => {
        return song.title.includes($query) &&
          (!$title || ($title && !song.hasFileName)) &&
          (!$cover || ($cover && !song.artPath)) &&
          (!$album || ($album && !song.album)) &&
          (!$artist || ($artist && !song.artist)) &&
          (!$albumArtist || ($albumArtist && song.albumArtist)) &&
          (!$genre || ($genre && !song.genre)) &&
          (!$year || ($year && song.releaseYear === -1));
      });
      if (songResults.length > 0) results.push("Songs", ...songResults);
    }

    if (($chips.length === 0 || $chips.includes("album")) && !($title || $album || $artist)) {
      const albumResults = $albums.filter((album) => {
        return album.name.includes($query) &&
          (!$cover || ($cover && !album.artPath)) &&
          (!$albumArtist || ($albumArtist && album.albumArtist)) &&
          (!$genre || ($genre && !album.genre)) &&
          (!$year || ($year && album.releaseYear === -1));
      });
      if (albumResults.length > 0) results.push("Albums", ...albumResults);
    }

    const onlyShowIsDisabled = !($title || $cover || $album || $artist || $albumArtist || $genre || $year);

    if (($chips.length === 0 || $chips.includes("artist")) && onlyShowIsDisabled) {
      const artistsResults = $artists.filter((artist) => artist.name.includes($query));
      if (artistsResults.length > 0) results.push("Artists", ...artistsResults);
    }

    if (($chips.length === 0 || $chips.includes("playlist")) && onlyShowIsDisabled) {
      const playlistsResults = $playlists.filter((playlist) => playlist.name.includes($query));
      if (playlistsResults.length > 0) results.push("Playlists", ...playlistsResults);
    }
    
    if (($chips.length === 0 || $chips.includes("genre")) && onlyShowIsDisabled) {
      const genreResults = $genres.filter((genre) => genre.name.includes($query));
      if (genreResults.length > 0) results.push("Genres", ...genreResults);
    }

    return results;
  });
</script>

<div class="inner-content">
  {#if $searchResults.length > 0}
    {#key $searchResults.length}
      <VirtualizedResults items={$searchResults} keyFunction={(entry) => entry.data.id ?? entry.data.name ?? entry.data} let:entry>
        {#if typeof entry === "string"}
          <SearchSection label={entry} />
        {:else if !!entry.title}
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
      <div class="message">No search results for the these filters</div>
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
    font-size: 18px;
    text-align: center;
  }
</style>