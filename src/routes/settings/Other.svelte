<script lang="ts">
  import { pop } from "svelte-spa-router";
  import { filterSongDuration, pauseOnVolumeZero, selectedLanguage } from "../../stores/State";
  import { showBlacklistFolders, showSelectLanguage } from "../../stores/Modals";
  import { getLanguage } from "../../types/Settings";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import SettingSection from "../../components/views/settings/SettingSection.svelte";
  import ToggleSetting from "../../components/views/settings/entries/ToggleSetting.svelte";
  import SliderSetting from "../../components/views/settings/entries/SliderSetting.svelte";
  import ButtonSetting from "../../components/views/settings/entries/ButtonSetting.svelte";
  
  import Mute from "@ktibow/iconset-material-symbols/volume-off-rounded";
  import Language from "@ktibow/iconset-material-symbols/translate-rounded";
  import VisibilityOff from "@ktibow/iconset-material-symbols/visibility-off-rounded";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Other" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <SettingSection label="Blacklist" />
    <ButtonSetting label="Blacklisted Folders" description={"Blacklisted folders are excluded from being loaded"} icon={VisibilityOff} on:click={() => $showBlacklistFolders = true} />
    <SettingSection label="Advanced" />
    <SliderSetting label="Max Song Length" description="Filters out songs that are longer than the provided value (in minutes)" max={60} bind:value={$filterSongDuration} />
    <ToggleSetting label="Pause on Mute" description="Pauses the music when the volume decreases to zero and starts playing when the volume goes above zero." icon={Mute} bind:checked={$pauseOnVolumeZero} />
    <ButtonSetting label="Change Language" description={getLanguage($selectedLanguage)} icon={Language} on:click={() => $showSelectLanguage = true} />
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