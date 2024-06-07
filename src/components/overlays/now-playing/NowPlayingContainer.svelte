<script lang="ts">
  import { showMiniPlayer, showNowPlaying } from "../../../stores/Overlays";
  import { selectedView } from "../../../stores/State";
  import { View } from "../../../types/View";
  import MiniPlayer from "./MiniPlayer.svelte";
  import NowPlaying from "./NowPlaying.svelte";
</script>

{#if $selectedView !== View.SETTINGS && $selectedView !== View.SEARCH}
  {#if $showNowPlaying && $showMiniPlayer}
    <MiniPlayer />
  {:else if $showNowPlaying}
    <NowPlaying />
  {/if}
{/if}