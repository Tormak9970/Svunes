<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import ViewNav from "./components/navigation/mobile/ViewNav.svelte";
  import MiniPlayer from "./components/MiniPlayer.svelte";
  import Titlebar from "./components/Titlebar.svelte";
  import "./lib/external/md3-index";
  import { isLoading, showMiniPlayer, showViewNav } from "./stores/State";
  import Overlays from "./components/overlays/Overlays.svelte";
  import { AppController } from "./lib/controllers/AppController";
  import { SettingsController } from "./lib/controllers/SettingsController";
  import { ThemeController } from "./lib/controllers/ThemeController";
  import View from "./components/views/View.svelte";
  import HomeLoadingAnimation from "./components/layout/HomeLoadingAnimation.svelte";
    import SelectHeader from "./components/SelectHeader.svelte";
    import { inSelectMode } from "./stores/Select";

  let isDesktop = false;

  onMount(async () => {
    await SettingsController.init();
    AppController.init();
    ThemeController.init();
  });

  onDestroy(() => {
    AppController.destroy();
    SettingsController.destroy();
  });
</script>

<main>
  <Overlays />
  {#if $showViewNav}
    <ViewNav />
  {/if}
  {#if $showMiniPlayer}
    <MiniPlayer />
  {/if}
  <div class="content">
    {#if $isLoading}
      <HomeLoadingAnimation />
    {:else}
      {#if $inSelectMode}
        <SelectHeader />
      {/if}
      <View />
    {/if}
  </div>
  {#if isDesktop}
    <Titlebar title="Tunistic" />
  {/if}
</main>

<style>
  main {
    height: 100%;
    width: 100%;

    background-color: var(--md-sys-color-background);
    color: var(--md-sys-color-on-background);

    display: flex;
    align-items: center;
    flex-direction: column-reverse;
  }

  .content {
    flex-grow: 1;
    width: 100%;
    
    position: relative;
  }
</style>
