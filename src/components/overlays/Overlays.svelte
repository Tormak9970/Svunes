<script>
  import { showQueue } from "@stores/Overlays";
  import AddToPlaylists from "./add-to-playlists/AddToPlaylists.svelte";
  import CarMode from "./CarMode.svelte";
  import CreatePlaylist from "./CreatePlaylist.svelte";
  import Queue from "./queue/Queue.svelte";
  import SleepTimer from "./SleepTimer.svelte";
  import WritingChanges from "./WritingChanges.svelte";
</script>

<AddToPlaylists />
<CreatePlaylist />

{#if $showQueue}
  <Queue />
{/if}
<CarMode />
<WritingChanges />

<SleepTimer />