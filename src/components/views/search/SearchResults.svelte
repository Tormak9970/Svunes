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

  const songResults = derived([
    songs,
    searchQuery,
    showOnlyMissingTitle,
    showOnlyMissingCover,
    showOnlyMissingAlbum,
    showOnlyMissingArtist,
    showOnlyMissingAlbumArtist,
    showOnlyMissingGenre,
    showOnlyMissingYear
  ], ([songs, query, title, cover, album, artist, albumArtist, genre, year]) => {
    return songs.filter((song) => {
      return song.title.includes(query) &&
        (!title || (title && song.title === song.fileName)) &&
        (!cover || (cover && !song.artPath)) &&
        (!album || (album && !song.album)) &&
        (!artist || (artist && !song.artist)) &&
        (!albumArtist || (albumArtist && song.albumArtist)) &&
        (!genre || (genre && !song.genre)) &&
        (!year || (year && song.releaseYear === -1));
    });
  });

  const albumResults = derived(
    [ albums, searchQuery, showOnlyMissingCover, showOnlyMissingAlbumArtist, showOnlyMissingGenre, showOnlyMissingYear ],
    ([albums, query, cover, albumArtist, genre, year]) => {
      return albums.filter((album) => {
        return album.name.includes(query) &&
          (!cover || (cover && !album.artPath)) &&
          (!albumArtist || (albumArtist && album.albumArtist)) &&
          (!genre || (genre && !album.genre)) &&
          (!year || (year && album.releaseYear === -1));
      });
    }
  );

  const artistResults = derived([artists, searchQuery], ([artists, query]) => {
    return artists.filter((artist) => artist.name.includes(query));
  });

  const playlistResults = derived([playlists, searchQuery], ([playlists, query]) => {
    return playlists.filter((playlist) => playlist.name.includes(query));
  });

  const genreResults = derived([genres, searchQuery], ([genres, query]) => {
    return genres.filter((genre) => genre.name.includes(query));
  });

  const hasSearchResults = derived([
    searchQuery,
    showOnlyMissingTitle,
    showOnlyMissingCover,
    showOnlyMissingAlbum,
    showOnlyMissingArtist,
    showOnlyMissingAlbumArtist,
    showOnlyMissingGenre,
    showOnlyMissingYear,
    songResults,
    albumResults,
    artistResults,
    playlistResults,
    genreResults
  ],
  ([query, title, cover, album, artist, albumArtist, genre, year, songs, albums, artists, playlists, genres]) => {
    return (query.length > 0 || title || cover || album || artist || albumArtist || genre || year) &&
      (songs.length > 0 || albums.length > 0 || artists.length > 0 || playlists.length > 0 || genres.length > 0);
  });

  const searchResults = derived(
    [selectedChips, songResults, albumResults, artistResults, playlistResults, genreResults],
    ([chips, songs, albums, artists, playlists, genres]) => {
      const results: (string | Song | Album | Artist | Playlist | Genre)[] = [];

      if ((chips.length === 0 || chips.includes("song")) && songs.length > 0) results.push("Songs", ...songs);
      if ((chips.length === 0 || chips.includes("album")) && albums.length > 0) results.push("Albums", ...albums);
      if ((chips.length === 0 || chips.includes("artist")) && artists.length > 0) results.push("Artists", ...artists);
      if ((chips.length === 0 || chips.includes("playlist")) && playlists.length > 0) results.push("Playlists", ...playlists);
      if ((chips.length === 0 || chips.includes("genre")) && genres.length > 0) results.push("Genres", ...genres);

      return results;
    }
  );
</script>

<div class="inner-content">
  {#if $hasSearchResults}
    {#key $searchResults.length}
      <VirtualizedResults items={$searchResults} keyFunction={(entry) => entry.data.id ?? entry.data.name ?? entry.data} let:entry>
        {#if typeof entry === "string"}
          <SearchSection label={entry} />
        {:else if !!entry.title}
          <SongListEntry song={entry} isSelectable={false} />
        {:else if !!entry.artists && !!entry.releaseYear}
          <AlbumListEntry album={entry} isSelectable={false} />
        {:else if !!entry.albumNames}
          <ArtistListEntry artist={entry} isSelectable={false} />
        {:else if !!entry.dateCreated}
          <PlaylistListEntry playlist={entry} isSelectable={false} />
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