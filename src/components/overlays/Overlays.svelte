<script>
  import { showSongDetails, showSongGridSize } from "../../stores/Overlays";
  import SongDetails from "./details/SongDetails.svelte";
  import EditMusicFolders from "./edit-music-folders/EditMusicFolders.svelte";
  import SongOptions from "./options/SongOptions.svelte";
  import SongGridSize from "./view-settings/SongGridSize.svelte";
  import SongSortOrder from "./view-settings/SongSortOrder.svelte";

</script>

<EditMusicFolders />
{#if $showSongDetails}
  <SongDetails />
{/if}
<SongGridSize />
<SongSortOrder />
<SongOptions />