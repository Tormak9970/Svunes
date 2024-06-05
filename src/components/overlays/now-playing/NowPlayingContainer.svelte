<script lang="ts">
  import { showMiniPlayer, showNowPlaying } from "../../../stores/Overlays";
  import MiniPlayer from "./MiniPlayer.svelte";
  import NowPlaying from "./NowPlaying.svelte";
</script>

{#if $showNowPlaying && $showMiniPlayer}
  <MiniPlayer />
{:else if $showNowPlaying}
  <NowPlaying />
{/if}