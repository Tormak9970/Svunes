<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import ViewNav from "./navigation/ViewNav.svelte";
  import Titlebar from "./Titlebar.svelte";
  import { autoPlayOnConnect, isLoading, isPaused, playingSongId, selectedView, showErrorSnackbar, showInfoSnackbar, showViewNav, songProgress, songsMap, volumeLevel } from "../stores/State";
  import Overlays from "./overlays/Overlays.svelte";
  import { AppController } from "../lib/controllers/AppController";
  import { SettingsController } from "../lib/controllers/SettingsController";
  import SelectHeader from "./views/SelectHeader.svelte";
  import { inSelectMode } from "../stores/Select";
  import { tauri, window } from "@tauri-apps/api";
  import { TauriEvent, type UnlistenFn } from "@tauri-apps/api/event";
  import Modals from "./modals/Modals.svelte";
  import { exit } from "@tauri-apps/api/process";
  import Router, { location, push } from 'svelte-spa-router'
  import { routes, viewRoutesLUT } from "../routes";
  import type { Unsubscriber } from "svelte/store";
  import ErrorSnackbar from "./snackbars/ErrorSnackbar.svelte";
  import InfoSnackbar from "./snackbars/InfoSnackbar.svelte";
  import { showSavingSettings } from "../stores/Modals";
  import { QueueController } from "../lib/controllers/QueueController";
  import NowPlayingContainer from "./overlays/now-playing/NowPlayingContainer.svelte";
  import { View } from "../types/View";
  import { showMiniPlayer, showNowPlaying } from "../stores/Overlays";
    import { PlaybackController } from "../lib/controllers/PlaybackController";

  let loadingUnsub: Unsubscriber;
  let isPausedUnsub: Unsubscriber;
  let playingSongIdUnsub: Unsubscriber;
  let closeRequestListener: UnlistenFn;

  let audioPlayer: HTMLAudioElement;

  let isDesktop = false;

  let oldNumAudioDevices: number;

  function handleMediaDeviceChange() {
    navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) => {
      const numAudioDevices = devices.filter((device) => device.kind.includes("audio")).length;

      if (oldNumAudioDevices && $autoPlayOnConnect) {
        if (numAudioDevices > oldNumAudioDevices && $isPaused) {
          PlaybackController.resume();
        } else if (numAudioDevices < oldNumAudioDevices && !$isPaused) {
          PlaybackController.pause();
        }
      }

      oldNumAudioDevices = numAudioDevices;
    });
  }

  onMount(async () => {
    handleMediaDeviceChange();
    navigator.mediaDevices.ondevicechange = handleMediaDeviceChange;

    playingSongIdUnsub = playingSongId.subscribe((id) => {
      if (id !== "") {
        const song = $songsMap[id];
        audioPlayer.src = tauri.convertFileSrc(song.filePath);
        audioPlayer.load();

        if (!$isPaused) {
          audioPlayer.play();
        }
      }
    });

    isPausedUnsub = isPaused.subscribe((paused) => {
      if (paused) {
        audioPlayer.pause();
      } else {
        audioPlayer.play();
      }
    })

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
    if (isPausedUnsub) isPausedUnsub();
    if (playingSongIdUnsub) playingSongIdUnsub();
    if (closeRequestListener) closeRequestListener();
  });
</script>

<audio style="display: none;" bind:this={audioPlayer} bind:currentTime={$songProgress} bind:volume={$volumeLevel} on:ended={QueueController.skip} />
<Overlays />
<Modals />
{#if $showViewNav && !($showNowPlaying && !$showMiniPlayer)}
  <ViewNav />
{/if}
{#if $selectedView !== View.SETTINGS && !$location.endsWith("/edit") && $selectedView !== View.SEARCH && $showNowPlaying}
  <NowPlayingContainer />
{/if}

<div class="content" style="height: {$showViewNav ? "calc(100% - 56px)" : "100%"};">
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
    
    position: absolute;
    top: 0;
  }
</style>
