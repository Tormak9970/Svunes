<script lang="ts">
  import { pop } from "svelte-spa-router";
  import { showNowPlayingTheme } from "../../stores/Modals";
  import { circularPlayButton, nowPlayingMiniUseAlbumColors, nowPlayingTheme, nowPlayingUseAlbumColors, showExtraSongInfo } from "../../stores/State";
  import { getNowPlayingTheme } from "../../types/Settings";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import SettingSection from "../../components/views/settings/SettingSection.svelte";
  import ButtonSetting from "../../components/views/settings/entries/ButtonSetting.svelte";
  import ToggleSetting from "../../components/views/settings/entries/ToggleSetting.svelte";
  
  import NowPlaying from "@ktibow/iconset-material-symbols/play-circle-outline-rounded";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Now Playing" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <ButtonSetting label="Now Playing Theme" description={getNowPlayingTheme($nowPlayingTheme)} icon={NowPlaying} on:click={() => $showNowPlayingTheme = true} />
    <ToggleSetting label="Extra Song Info" description={"Show extra song info, such as the file format, bitrate, and frequency"} bind:checked={$showExtraSongInfo} />
    <ToggleSetting label="Circular Play Button" description={"Makes the pause/play button circular"} bind:checked={$circularPlayButton} />
    <ToggleSetting label="Use Album Color" description={"Themes the now playing page based on the album's cover"} bind:checked={$nowPlayingUseAlbumColors} />
    <ToggleSetting label="Use Color for Mini" description={"Themes the mini player based on the album's cover"} bind:checked={$nowPlayingMiniUseAlbumColors} />
    <SettingSection label="Controls" />
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