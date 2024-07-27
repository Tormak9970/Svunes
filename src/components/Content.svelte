<script lang="ts">
  import { ApiController } from "@lib/controllers/ApiController";
  import { DeviceController } from "@lib/controllers/DeviceController";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import { QueueController } from "@lib/controllers/QueueController";
  import { SettingsController } from "@lib/controllers/SettingsController";
  import { desktopSidePanel, sidePanelProps } from "@stores/Desktop";
  import { showNowPlaying } from "@stores/Overlays";
  import { inSelectMode } from "@stores/Select";
  import { autoPlayOnConnect, isLoading, isPaused, playingSongId, playlists, selectedView, shouldPauseOnEnd, showErrorSnackbar, showInfoSnackbar, showNav, songProgress, songsMap, volumeLevel } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { onDestroy, onMount } from "svelte";
  import Router, { location, pop, push, replace, type ConditionsFailedEvent } from 'svelte-spa-router';
  import type { Unsubscriber } from "svelte/store";
  import { AppController } from "../lib/controllers/AppController";
  import { hash64 } from "../lib/utils/Utils";
  import { routes } from "../routes";
  import { systemDefaultLanguage, t } from "../stores/Locale";
  import { getViewRoute, View } from "../types/View";
  import DesktopViewWrapper from "./desktop/DesktopViewWrapper.svelte";
  import Modals from "./modals/Modals.svelte";
  import MobileNav from "./navigation/MobileNav.svelte";
  import NowPlayingContainer from "./overlays/now-playing/NowPlayingContainer.svelte";
  import Overlays from "./overlays/Overlays.svelte";
  import ErrorSnackbar from "./snackbars/ErrorSnackbar.svelte";
  import InfoSnackbar from "./snackbars/InfoSnackbar.svelte";
  import SelectHeader from "./views/SelectHeader.svelte";

  let loadingUnsub: Unsubscriber;
  let isPausedUnsub: Unsubscriber;
  let playingSongIdUnsub: Unsubscriber;
  let translateUnsub: Unsubscriber;

  let audioPlayer: HTMLAudioElement;

  let oldNumAudioDevices: number;

  function conditionsFailed(event: ConditionsFailedEvent) {
    const userData = event.detail.userData as any;
    
    if (userData?.reason === 'album-key-dne') {
      userData.reason = "none";
      replace("/albums");
    } else if (userData?.reason === 'needs-side') {
      userData.reason = "none";
      $sidePanelProps = event.detail.params;
      $desktopSidePanel = userData!.sidePanel;
      pop();
    } else {
      console.error("conditionsFailed event:", event.detail);
    }
  }

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
    ApiController.init();

    handleMediaDeviceChange();
    navigator.mediaDevices.ondevicechange = handleMediaDeviceChange;

    window.onlanguagechange = () => {
      $systemDefaultLanguage = navigator.language;
    }

    playingSongIdUnsub = playingSongId.subscribe((id) => {
      if (id !== "") {
        const song = $songsMap[id];
        audioPlayer.src = convertFileSrc(song.filePath);
        audioPlayer.load();

        if ($shouldPauseOnEnd) {
          $isPaused = true;
          return;
        }

        if (!$isPaused) audioPlayer.play();
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
      if (!newStatus) push(getViewRoute($selectedView));
    });

    await SettingsController.init();
    AppController.init();
    DeviceController.init();
    
    translateUnsub = t.subscribe((translate) => {
      const favoritesId = hash64("Favorites");
      const favoritesPlaylist = $playlists.find((playlist) => playlist.id === favoritesId)!;
      favoritesPlaylist.name = translate("FAVORITES_PLAYLIST_TITLE");

      $playlists = [ ...$playlists ];
    });
  });

  onDestroy(async () => {
    DeviceController.destroy();
    AppController.destroy();
    SettingsController.destroy();

    await ApiController.destroy();

    if (translateUnsub) translateUnsub();
    if (loadingUnsub) loadingUnsub();
    if (isPausedUnsub) isPausedUnsub();
    if (playingSongIdUnsub) playingSongIdUnsub();
  });
</script>

<audio style="display: none;" bind:this={audioPlayer} bind:currentTime={$songProgress} bind:volume={$volumeLevel} on:ended={QueueController.skip} />
<Overlays />
<Modals />

<ErrorSnackbar bind:show={$showErrorSnackbar} />
<InfoSnackbar bind:show={$showInfoSnackbar} />

<DesktopViewWrapper>
  <!-- svelte-ignore missing-declaration -->
  {#if $showNav && IS_MOBILE}
    <MobileNav />
  {/if}
  <!-- svelte-ignore missing-declaration -->
  {#if $selectedView !== View.SETTINGS && !$location.endsWith("/edit") && $showNowPlaying && IS_MOBILE}
    <NowPlayingContainer />
  {/if}

  <!-- svelte-ignore missing-declaration -->
  <div class="content" style:height={($showNav && IS_MOBILE) ? "calc(100% - 56px)" : "100%"}>
    {#if $inSelectMode}
      <SelectHeader />
    {/if}
    <Router {routes} restoreScrollState={true} on:conditionsFailed={conditionsFailed} />
  </div>
</DesktopViewWrapper>

<style>
  .content {
    width: 100%;
  }
</style>
