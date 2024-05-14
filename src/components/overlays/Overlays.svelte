<script>
  import { showSongDetails } from "../../stores/Overlays";
  import SongDetails from "./details/SongDetails.svelte";
  import EditMusicFolders from "./edit-music-folders/EditMusicFolders.svelte";

</script>

<EditMusicFolders />
{#if $showSongDetails}
  <SongDetails />
{/if}