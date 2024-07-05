<script>
  import AdvancedSearchFilters from "./AdvancedSearchFilters.svelte";
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
  import AlbumSortOrder from "./view-settings/AlbumSortOrder.svelte";
  import ArtistSortOrder from "./view-settings/ArtistSortOrder.svelte";
  import GridSize from "./view-settings/GridSize.svelte";
  import PlaylistSortOrder from "./view-settings/PlaylistSortOrder.svelte";
  import SongSortOrder from "./view-settings/SongSortOrder.svelte";

</script>

<!-- ? View option modals -->
<GridSize />
<PlaylistSortOrder />
<SongSortOrder />
<AlbumSortOrder />
<ArtistSortOrder />

<!-- ? Misc -->
<EditMusicFolders />
<ArtOptions />
<Controlled />
<AdvancedSearchFilters />
<ParserVariables />

<!-- ? Settings -->
<BlacklistFolders />
<LanguageSelect />
<EditViewOrder />
<NowPlayingTheme />
<NowPlayingBackground />
<SavingSettings />