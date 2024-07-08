<script lang="ts">
  import { showNowPlayingBackground, showNowPlayingTheme } from "@stores/Modals";
  import { autoDetectCarMode, dismissMiniPlayerWithSwipe, extraControl, nowPlayingBackgroundType, nowPlayingTheme, showExtraSongInfo, showVolumeControls } from "@stores/State";
  import { pop } from "svelte-spa-router";
  import { getNowPlayingBackgroundType, getNowPlayingTheme, type NowPlayingExtraControl } from "../../types/Settings";

  import MultiButton from "@interactables/multi-button/MultiButton.svelte";
  import SettingSection from "@views/settings/SettingSection.svelte";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  import MultiButtonSetting from "@views/settings/entries/MultiButtonSetting.svelte";
  import ToggleSetting from "@views/settings/entries/ToggleSetting.svelte";
  
  import Bedtime from "@ktibow/iconset-material-symbols/bedtime-outline-rounded";
  import DirectionsCar from "@ktibow/iconset-material-symbols/directions-car-outline-rounded";
  import HideSource from "@ktibow/iconset-material-symbols/hide-source-outline-rounded";
  import Imagesmode from "@ktibow/iconset-material-symbols/imagesmode-outline-rounded";
  import MinorCrash from "@ktibow/iconset-material-symbols/minor-crash-rounded";
  import PlayCircle from "@ktibow/iconset-material-symbols/play-circle-outline-rounded";
  import SwipeDownAlt from "@ktibow/iconset-material-symbols/swipe-down-alt-rounded";
  import VolumeUp from "@ktibow/iconset-material-symbols/volume-up-rounded";

  function setAdditionalControl(control: NowPlayingExtraControl) {
    $extraControl = control;
  }
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Now Playing" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <ButtonSetting label="Now Playing Theme" description={getNowPlayingTheme($nowPlayingTheme)} icon={PlayCircle} on:click={() => $showNowPlayingTheme = true} />
    <ButtonSetting label="Background Type" description={getNowPlayingBackgroundType($nowPlayingBackgroundType)} icon={Imagesmode} on:click={() => $showNowPlayingBackground = true} />
    <ToggleSetting label="Extra Song Info" description="Show extra song info, such as the file format, bitrate, and frequency" bind:checked={$showExtraSongInfo} />
    <ToggleSetting label="Auto Car Mode" icon={MinorCrash} description="Automatically enable car mode while you're driving" bind:checked={$autoDetectCarMode} />
    <SettingSection label="Controls" />
    <ToggleSetting label="Dismiss with swipe down" description="Swipe down to dismiss the mini player" icon={SwipeDownAlt} bind:checked={$dismissMiniPlayerWithSwipe} />
    <ToggleSetting label="Volume Controls" description="Displays volume controls if there is enough space" icon={VolumeUp} bind:checked={$showVolumeControls} />
    <MultiButtonSetting label="Additional Control" description="Choose which extra control to display on the now playing screen">
      <MultiButton name="additional-control" id="carMode" icon={DirectionsCar} checked={$extraControl === "Car Mode"} on:input={() => setAdditionalControl("Car Mode")}>Car Mode</MultiButton>
      <MultiButton name="additional-control" id="sleepTimer" icon={Bedtime} checked={$extraControl === "Sleep Timer"} on:input={() => setAdditionalControl("Sleep Timer")}>Sleep</MultiButton>
      <MultiButton name="additional-control" id="none" icon={HideSource} checked={$extraControl === "None"} on:input={() => setAdditionalControl("None")}>None</MultiButton>
    </MultiButtonSetting>
  </span>
</SettingsBody>

<style>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>