<script lang="ts">
  import "./lib/md-defs";
  import { onDestroy, onMount } from "svelte";
  import ViewNav from "./components/navigation/ViewNav.svelte";
  import MiniPlayer from "./components/overlays/MiniPlayer.svelte";
  import Titlebar from "./components/Titlebar.svelte";
  import { isLoading, selectedView, showMiniPlayer } from "./stores/State";
  import Overlays from "./components/overlays/Overlays.svelte";
  import { AppController } from "./lib/controllers/AppController";
  import { SettingsController } from "./lib/controllers/SettingsController";
  import { ThemeController } from "./lib/controllers/ThemeController";
  import SelectHeader from "./components/views/SelectHeader.svelte";
  import { inSelectMode } from "./stores/Select";
  import { StyleFromScheme } from "m3-svelte";
  import { window } from "@tauri-apps/api";
  import type { UnlistenFn } from "@tauri-apps/api/event";
  import Modals from "./components/modals/Modals.svelte";
  import { exit } from "@tauri-apps/api/process";
  import Router, { location, push } from 'svelte-spa-router'
  import { routes, viewRoutesLUT } from "./routes";
  import type { Unsubscriber } from "svelte/store";

  let loadingUnsub: Unsubscriber;
  let closeRequestListener: UnlistenFn;

  let isDesktop = false;

  $: console.log($location);

  onMount(async () => {
    loadingUnsub = isLoading.subscribe((newStatus) => {
      if (!newStatus) push(viewRoutesLUT[$selectedView]);
    })
    await SettingsController.init();
    AppController.init();
    ThemeController.init();

    closeRequestListener = await window.appWindow.listen("tauri://close-requested", async (e) => {
      // TODO: check if settings save is in progress, if show, show overlay
      await SettingsController.save();
      await exit(0);
    });
  });

  onDestroy(() => {
    AppController.destroy();
    SettingsController.destroy();

    if (loadingUnsub) loadingUnsub();
    if (closeRequestListener) closeRequestListener();
  });
</script>

<main>
  <StyleFromScheme
    lightScheme={{"primary":4285551241,"onPrimary":4294967295,"primaryContainer":4294040319,"onPrimaryContainer":4280880193,"inversePrimary":4292655608,"secondary":4284897903,"onSecondary":4294967295,"secondaryContainer":4293778934,"onSecondaryContainer":4280358953,"tertiary":4286599510,"onTertiary":4294967295,"tertiaryContainer":4294957532,"onTertiaryContainer":4281470998,"error":4290386458,"onError":4294967295,"errorContainer":4294957782,"onErrorContainer":4282449922,"background":4294965246,"onBackground":4280162848,"surface":4294965246,"onSurface":4280162848,"surfaceVariant":4293517290,"onSurfaceVariant":4283123021,"inverseSurface":4281544501,"inverseOnSurface":4294438646,"outline":4286346622,"outlineVariant":4291675342,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4292925663,"surfaceBright":4294965246,"surfaceContainerLowest":4294967295,"surfaceContainerLow":4294636025,"surfaceContainer":4294241267,"surfaceContainerHigh":4293846765,"surfaceContainerHighest":4293452008,"surfaceTint":4285551241}}
    darkScheme={{"primary":4292655608,"onPrimary":4282327896,"primaryContainer":4283906672,"onPrimaryContainer":4294040319,"inversePrimary":4285551241,"secondary":4291936729,"onSecondary":4281805887,"secondaryContainer":4283318870,"onSecondaryContainer":4293778934,"tertiary":4294162364,"onTertiary":4283180330,"tertiaryContainer":4284889663,"onTertiaryContainer":4294957532,"error":4294948011,"onError":4285071365,"errorContainer":4287823882,"onErrorContainer":4294957782,"background":4279570967,"onBackground":4293452008,"surface":4279570967,"onSurface":4293452008,"surfaceVariant":4283123021,"onSurfaceVariant":4291675342,"inverseSurface":4293452008,"inverseOnSurface":4281544501,"outline":4288056984,"outlineVariant":4283123021,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4279570967,"surfaceBright":4282136638,"surfaceContainerLowest":4279242002,"surfaceContainerLow":4280162848,"surfaceContainer":4280426020,"surfaceContainerHigh":4281084206,"surfaceContainerHighest":4281807673,"surfaceTint":4292655608}} />
  <Overlays />
  <Modals />
  {#if $location.lastIndexOf("/") === 0 && $location !== "/settings"}
    <ViewNav />
  {/if}
  {#if $showMiniPlayer}
    <MiniPlayer />
  {/if}
  <div class="content">
    {#if $inSelectMode}
      <SelectHeader />
    {/if}
    <Router {routes} restoreScrollState={true} />
  </div>
  {#if isDesktop}
    <Titlebar title="Tunistic" />
  {/if}
</main>

<style>
  main {
    height: 100%;
    width: 100%;

    background-color: rgb(var(--m3-scheme-background));
    color: rgb(var(--m3-scheme-on-background));

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
