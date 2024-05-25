<script>
  import ArtOptions from "./ArtOptions.svelte";
  import EditMusicFolders from "./EditMusicFolders.svelte";
  import GridSize from "./view-settings/GridSize.svelte";
  import PlaylistSortOrder from "./view-settings/PlaylistSortOrder.svelte";
  import SongSortOrder from "./view-settings/SongSortOrder.svelte";
  import AlbumSortOrder from "./view-settings/AlbumSortOrder.svelte";
  import ArtistSortOrder from "./view-settings/ArtistSortOrder.svelte";
  import BlacklistFolders from "./BlacklistFolders.svelte";
  import LanguageSelect from "./LanguageSelect.svelte";
  import ViewOrder from "./ViewOrder.svelte";
  import NowPlayingTheme from "./NowPlayingTheme.svelte";

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

<!-- ? Settings -->
<BlacklistFolders />
<LanguageSelect />
<ViewOrder />
<NowPlayingTheme />