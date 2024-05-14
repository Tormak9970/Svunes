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
  import { StyleFromScheme } from "m3-svelte";

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
  <StyleFromScheme
    lightScheme={{"primary":4282476597,"onPrimary":4294967295,"primaryContainer":4290899887,"onPrimaryContainer":4278329600,"inversePrimary":4289123221,"secondary":4283720525,"onSecondary":4294967295,"secondaryContainer":4292339916,"onSecondaryContainer":4279377678,"tertiary":4281886312,"onTertiary":4294967295,"tertiaryContainer":4290571246,"onTertiaryContainer":4278198305,"error":4290386458,"onError":4294967295,"errorContainer":4294957782,"onErrorContainer":4282449922,"background":4294507504,"onBackground":4279835927,"surface":4294507504,"onSurface":4279835927,"surfaceVariant":4292863191,"onSurfaceVariant":4282599487,"inverseSurface":4281217579,"inverseOnSurface":4293915368,"outline":4285757806,"outlineVariant":4291020988,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4292402130,"surfaceBright":4294507504,"surfaceContainerLowest":4294967295,"surfaceContainerLow":4294112747,"surfaceContainer":4293717989,"surfaceContainerHigh":4293323231,"surfaceContainerHighest":4292994266,"surfaceTint":4282476597}}
    darkScheme={{"primary":4289123221,"onPrimary":4279384074,"primaryContainer":4280897311,"onPrimaryContainer":4290899887,"inversePrimary":4282476597,"secondary":4290497457,"onSecondary":4280759329,"secondaryContainer":4282207031,"onSecondaryContainer":4292339916,"tertiary":4288729041,"onTertiary":4278204217,"tertiaryContainer":4280176208,"onTertiaryContainer":4290571246,"error":4294948011,"onError":4285071365,"errorContainer":4287823882,"onErrorContainer":4294957782,"background":4279309327,"onBackground":4292994266,"surface":4279309327,"onSurface":4292994266,"surfaceVariant":4282599487,"onSurfaceVariant":4291020988,"inverseSurface":4292994266,"inverseOnSurface":4281217579,"outline":4287468423,"outlineVariant":4282599487,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4279309327,"surfaceBright":4281809460,"surfaceContainerLowest":4278980362,"surfaceContainerLow":4279835927,"surfaceContainer":4280099099,"surfaceContainerHigh":4280757029,"surfaceContainerHighest":4281480751,"surfaceTint":4289123221}} />
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

    position: relative;
  }

  .content {
    flex-grow: 1;
    width: 100%;
    
    position: relative;
  }
</style>
