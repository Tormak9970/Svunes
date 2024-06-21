<script lang="ts">
  import { pop } from "svelte-spa-router";
  import { showNowPlayingBackground, showNowPlayingTheme } from "../../stores/Modals";
  import { circularPlayButton, dismissMiniPlayerWithSwipe, nowPlayingBackgroundType, nowPlayingTheme, nowPlayingUseAlbumColors, showExtraControls, showExtraSongInfo, showVolumeControls } from "../../stores/State";
  import { getNowPlayingBackgroundType, getNowPlayingTheme } from "../../types/Settings";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import SettingSection from "../../components/views/settings/SettingSection.svelte";
  import ButtonSetting from "../../components/views/settings/entries/ButtonSetting.svelte";
  import ToggleSetting from "../../components/views/settings/entries/ToggleSetting.svelte";
  
  import NowPlaying from "@ktibow/iconset-material-symbols/play-circle-outline-rounded";
  import LayoutBackground from "@ktibow/iconset-material-symbols/imagesmode-outline-rounded";
  import SwipeDownAlt from "@ktibow/iconset-material-symbols/swipe-down-alt-rounded";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import VolumeUp from "@ktibow/iconset-material-symbols/volume-up-rounded";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Now Playing" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <ButtonSetting label="Now Playing Theme" description={getNowPlayingTheme($nowPlayingTheme)} icon={NowPlaying} on:click={() => $showNowPlayingTheme = true} />
    <ButtonSetting label="Background Type" description={getNowPlayingBackgroundType($nowPlayingBackgroundType)} icon={LayoutBackground} on:click={() => $showNowPlayingBackground = true} />
    <ToggleSetting label="Use Album Color" description="Themes the now playing page based on the album's cover" bind:checked={$nowPlayingUseAlbumColors} />
    <ToggleSetting label="Circular Play Button" description="Makes the pause/play button circular" bind:checked={$circularPlayButton} />
    <ToggleSetting label="Extra Song Info" description="Show extra song info, such as the file format, bitrate, and frequency" bind:checked={$showExtraSongInfo} />
    <SettingSection label="Controls" />
    <ToggleSetting label="Dismiss with swipe down" description="Swipe down to dismiss the mini player" icon={SwipeDownAlt} bind:checked={$dismissMiniPlayerWithSwipe} />
    <ToggleSetting label="Extra Controls" description="Adds loop and shuffle controls to the now playing screen" icon={Play} bind:checked={$showExtraControls} />
    <ToggleSetting label="Volume Controls" description="Displays volume controls if there is enough space" icon={VolumeUp} bind:checked={$showVolumeControls} />
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