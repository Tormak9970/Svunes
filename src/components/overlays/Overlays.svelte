<script>
  import { showAlbumDetails, showArtistDetails, showEditAlbum, showEditSong, showGenreDetails, showPlaylistDetails, showSongDetails } from "../../stores/Overlays";
  import AblumDetails from "./details/AblumDetails.svelte";
  import ArtistDetails from "./details/ArtistDetails.svelte";
  import GenreDetails from "./details/GenreDetails.svelte";
  import PlaylistDetails from "./details/PlaylistDetails.svelte";
  import SongDetails from "./details/song-details/SongDetails.svelte";
  import SongEditor from "./editors/SongEditor.svelte";
  import AlbumEditor from "./editors/AlbumEditor.svelte";
  import SongOptions from "./SongOptions.svelte";

</script>

<!-- ? Entry details -->
{#if $showPlaylistDetails}
  <PlaylistDetails />
{/if}
{#if $showSongDetails}
  <SongDetails />
{/if}
{#if $showAlbumDetails}
  <AblumDetails />
{/if}
{#if $showArtistDetails}
  <ArtistDetails />
{/if}
{#if $showGenreDetails}
  <GenreDetails />
{/if}

<!-- ? Entry editing -->
{#if $showEditSong}
  <SongEditor />
{/if}
{#if $showEditAlbum}
  <AlbumEditor />
{/if}

<!-- ? Entry options -->
<SongOptions />