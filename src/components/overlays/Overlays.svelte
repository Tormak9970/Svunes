<script>
  import { showEditSong, showSongDetails } from "../../stores/Overlays";
  import SongDetails from "./details/SongDetails.svelte";
  import EditMusicFolders from "./edit-music-folders/EditMusicFolders.svelte";
  import SongEditor from "./editors/SongEditor.svelte";
  import SongOptions from "./SongOptions.svelte";
  import SongGridSize from "./view-settings/SongGridSize.svelte";
  import SongSortOrder from "./view-settings/SongSortOrder.svelte";

</script>

<!-- ? Entry details -->
{#if $showSongDetails}
  <SongDetails />
{/if}

<!-- ? Entry editing -->
{#if $showEditSong}
  <SongEditor />
{/if}

<!-- ? View option overlays -->
<SongGridSize />
<SongSortOrder />

<!-- ? Entry options -->
<SongOptions />

<!-- ? Misc -->
<EditMusicFolders />