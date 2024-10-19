<script>
  import { isLandscape } from "@stores/Layout";
  import { showAddToPlaylist, showCarMode, showCreatePlaylist, showQueue, showSleepTimerSelection, showWritingChanges } from "@stores/Overlays";
  import AddToPlaylists from "./add-to-playlists/AddToPlaylists.svelte";
  import CarMode from "./CarMode.svelte";
  import CreatePlaylist from "./CreatePlaylist.svelte";
  import Queue from "./queue/Queue.svelte";
  import SleepTimer from "./SleepTimer.svelte";
  import WritingChanges from "./WritingChanges.svelte";
</script>

<!-- ? Bottom Sheets -->
{#if $showAddToPlaylist}
  <AddToPlaylists />
{/if}
{#if $showCreatePlaylist}
  <CreatePlaylist />
{/if}
{#if $showSleepTimerSelection}
  <SleepTimer />
{/if}

<!-- ? Fullscreen -->
{#if $showQueue && !$isLandscape}
  <Queue />
{/if}
{#if $showCarMode}
  <CarMode />
{/if}
{#if $showWritingChanges}
  <WritingChanges />
{/if}