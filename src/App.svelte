<script lang="ts">
  import ViewNav from "./components/navigation/mobile/ViewNav.svelte";
  import NowPlayingSmall from "./components/NowPlayingSmall.svelte";
  import { ThemeController } from "./lib/controllers/ThemeController";
  import "./lib/external/md3-index";
  import { showNowPlayingSmall, showViewNav } from "./stores/State";

  ThemeController.init();
</script>

<main>
  {#if $showViewNav}
    <ViewNav />
  {/if}
  {#if $showNowPlayingSmall}
    <NowPlayingSmall />
  {/if}
  <div class="content">
    
  </div>
</main>

<style>
  main {
    height: 100%;
    width: 100%;

    background-color: var(--md-sys-color-surface-container-low);

    display: flex;
    flex-direction: column-reverse;
  }

  .content {
    flex-grow: 1;
  }
</style>
