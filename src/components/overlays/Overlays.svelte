<script>
  import { showEditSong, showSongDetails } from "../../stores/Overlays";
  import SongDetails from "./details/SongDetails.svelte";
  import SongEditor from "./editors/SongEditor.svelte";
  import SongOptions from "./SongOptions.svelte";

</script>

<!-- ? Entry details -->
{#if $showSongDetails}
  <SongDetails />
{/if}

<!-- ? Entry editing -->
{#if $showEditSong}
  <SongEditor />
{/if}

<!-- ? Entry options -->
<SongOptions />