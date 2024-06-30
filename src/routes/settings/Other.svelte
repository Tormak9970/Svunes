<script lang="ts">
  import { showBlacklistFolders, showSelectLanguage } from "@stores/Modals";
  import { filterSongDuration, selectedLanguage } from "@stores/State";
  import { pop } from "svelte-spa-router";
  import { getLanguage } from "../../types/Settings";

  import SettingSection from "@views/settings/SettingSection.svelte";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  import SliderSetting from "@views/settings/entries/SliderSetting.svelte";
  
  import Language from "@ktibow/iconset-material-symbols/translate-rounded";
  import VisibilityOff from "@ktibow/iconset-material-symbols/visibility-off-rounded";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Other" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <SettingSection label="Blacklist" />
    <ButtonSetting label="Blacklisted Folders" description="Blacklisted folders are excluded from being loaded" icon={VisibilityOff} on:click={() => $showBlacklistFolders = true} />
    <SettingSection label="Advanced" />
    <SliderSetting label="Max Song Length" description="Filters out songs that are longer than the provided value (in minutes)" max={60} bind:value={$filterSongDuration} />
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