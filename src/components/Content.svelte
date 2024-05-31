<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import ViewNav from "./navigation/ViewNav.svelte";
  import MiniPlayer from "./overlays/MiniPlayer.svelte";
  import Titlebar from "./Titlebar.svelte";
  import { isLoading, selectedView, showErrorSnackbar, showInfoSnackbar, showMiniPlayer } from "../stores/State";
  import Overlays from "./overlays/Overlays.svelte";
  import { AppController } from "../lib/controllers/AppController";
  import { SettingsController } from "../lib/controllers/SettingsController";
  import SelectHeader from "./views/SelectHeader.svelte";
  import { inSelectMode } from "../stores/Select";
  import { window } from "@tauri-apps/api";
  import { TauriEvent, type UnlistenFn } from "@tauri-apps/api/event";
  import Modals from "./modals/Modals.svelte";
  import { exit } from "@tauri-apps/api/process";
  import Router, { location, push } from 'svelte-spa-router'
  import { routes, viewRoutesLUT } from "../routes";
  import type { Unsubscriber } from "svelte/store";
  import ErrorSnackbar from "./snackbars/ErrorSnackbar.svelte";
  import InfoSnackbar from "./snackbars/InfoSnackbar.svelte";
    import { showSavingSettings } from "../stores/Modals";

  let loadingUnsub: Unsubscriber;
  let closeRequestListener: UnlistenFn;

  let isDesktop = false;

  onMount(async () => {
    loadingUnsub = isLoading.subscribe((newStatus) => {
      if (!newStatus) push(viewRoutesLUT[$selectedView]);
    });

    await SettingsController.init();
    AppController.init();

    closeRequestListener = await window.appWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, (e) => {
      if (SettingsController.settingsHaveChanged) {
        SettingsController.save().then(() => {
          $showSavingSettings = true;
          exit(0);
        });
      } else {
        exit(0);
      }
    });
  });

  onDestroy(() => {
    AppController.destroy();
    SettingsController.destroy();

    if (loadingUnsub) loadingUnsub();
    if (closeRequestListener) closeRequestListener();
  });
</script>

<Overlays />
<Modals />
{#if $location.lastIndexOf("/") === 0 && $location !== "/settings"}
  <ViewNav />
{/if}
{#if $showMiniPlayer}
  <MiniPlayer />
{/if}
<div class="content">
  <ErrorSnackbar bind:show={$showErrorSnackbar} />
  <InfoSnackbar bind:show={$showInfoSnackbar} />
  {#if $inSelectMode}
    <SelectHeader />
  {/if}
  <Router {routes} restoreScrollState={true} />
</div>
{#if isDesktop}
  <Titlebar title="Tunistic" />
{/if}

<style>
  .content {
    width: 100%;
    height: 100%;
    
    position: relative;
  }
</style>
