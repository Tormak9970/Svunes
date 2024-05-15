<script>
  import { showSongDetails } from "../../stores/Overlays";
  import SongDetails from "./details/SongDetails.svelte";
  import EditMusicFolders from "./edit-music-folders/EditMusicFolders.svelte";
  import SongOptions from "./SongOptions.svelte";
  import SongGridSize from "./view-settings/SongGridSize.svelte";
  import SongSortOrder from "./view-settings/SongSortOrder.svelte";

</script>

<!-- ? Entry details -->
{#if $showSongDetails}
  <SongDetails />
{/if}

<!-- ? Entry editing -->

<!-- ? View option overlays -->
<SongGridSize />
<SongSortOrder />

<!-- ? Entry options -->
<SongOptions />

<!-- ? Misc -->
<EditMusicFolders />