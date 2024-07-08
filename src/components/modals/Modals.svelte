<script>
  import { showAdvancedFilters, showAlbumInfoResults, showAlbumSortOrder, showArtistSortOrder, showArtOptions, showBlacklistFolders, showControlledModal, showEditMusicFolders, showEditViewOrder, showGridSize, showImageResults, showNowPlayingBackground, showNowPlayingTheme, showParserVariables, showPlaylistSortOrder, showSavingSettings, showSearchingApi, showSelectLanguage, showSongInfoResults, showSongSortOrder } from "@stores/Modals";
  import AdvancedSearchFilters from "./AdvancedSearchFilters.svelte";
  import AlbumInfoResults from "./api-results/AlbumInfoResults.svelte";
  import ImageResults from "./api-results/ImageResults.svelte";
  import SongInfoResults from "./api-results/SongInfoResults.svelte";
  import ArtOptions from "./ArtOptions.svelte";
  import BlacklistFolders from "./BlacklistFolders.svelte";
  import Controlled from "./Controlled.svelte";
  import EditMusicFolders from "./EditMusicFolders.svelte";
  import EditViewOrder from "./EditViewOrder.svelte";
  import LanguageSelect from "./LanguageSelect.svelte";
  import NowPlayingBackground from "./NowPlayingBackground.svelte";
  import NowPlayingTheme from "./NowPlayingTheme.svelte";
  import ParserVariables from "./ParserVariables.svelte";
  import SavingSettings from "./SavingSettings.svelte";
  import SearchingApi from "./SearchingApi.svelte";
  import AlbumSortOrder from "./view-settings/AlbumSortOrder.svelte";
  import ArtistSortOrder from "./view-settings/ArtistSortOrder.svelte";
  import GridSize from "./view-settings/GridSize.svelte";
  import PlaylistSortOrder from "./view-settings/PlaylistSortOrder.svelte";
  import SongSortOrder from "./view-settings/SongSortOrder.svelte";
</script>

<!-- ? View option modals -->
{#if $showGridSize}
  <GridSize />
{/if}
{#if $showPlaylistSortOrder}
  <PlaylistSortOrder />
{/if}
{#if $showSongSortOrder}
  <SongSortOrder />
{/if}
{#if $showAlbumSortOrder}
  <AlbumSortOrder />
{/if}
{#if $showArtistSortOrder}
  <ArtistSortOrder />
{/if}

<!-- ? Settings -->
{#if $showEditMusicFolders}
 <EditMusicFolders />
{/if}
{#if $showBlacklistFolders}
  <BlacklistFolders />
{/if}
{#if $showSelectLanguage}
  <LanguageSelect />
{/if}
{#if $showEditViewOrder}
  <EditViewOrder />
{/if}
{#if $showNowPlayingTheme}
  <NowPlayingTheme />
{/if}
{#if $showNowPlayingBackground}
  <NowPlayingBackground />
{/if}
{#if $showSavingSettings}
  <SavingSettings />
{/if}

<!-- ? Api searching -->
{#if $showSearchingApi}
  <SearchingApi />
{/if}
{#if $showSongInfoResults}
  <SongInfoResults />
{/if}
{#if $showAlbumInfoResults}
  <AlbumInfoResults />
{/if}
{#if $showImageResults}
  <ImageResults />
{/if}

<!-- ? Misc -->
{#if $showArtOptions}
  <ArtOptions />
{/if}
{#if $showControlledModal}
  <Controlled />
{/if}
{#if $showAdvancedFilters}
  <AdvancedSearchFilters />
{/if}
{#if $showParserVariables}
  <ParserVariables />
{/if}