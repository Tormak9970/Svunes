<script lang="ts">
  import { showBlacklistFolders, showEditMusicFolders, showSelectLanguage } from "@stores/Modals";
  import { filterSongDuration, selectedLanguage } from "@stores/State";
  import { pop } from "svelte-spa-router";
  import { getLanguage } from "../../types/Settings";

  import SettingSection from "@views/settings/SettingSection.svelte";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  import SliderSetting from "@views/settings/entries/SliderSetting.svelte";
  
  import FolderOpen from "@ktibow/iconset-material-symbols/folder-open-rounded";
  import Language from "@ktibow/iconset-material-symbols/translate-rounded";
  import VisibilityOff from "@ktibow/iconset-material-symbols/visibility-off-rounded";
  import t from "@lib/utils/i18n";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label={t("SETTINGS_OTHER_TITLE")} goBack={pop} />
  </span>
  <span class="content" slot="content">
    <ButtonSetting label={t("SETTINGS_OTHER_MUSIC_FOLDER_LABEL")} description={t("SETTINGS_OTHER_MUSIC_FOLDER_DESC")} icon={FolderOpen} on:click={() => $showEditMusicFolders = true} />
    <SettingSection label={t("SETTINGS_OTHER_BLACKLIST_LABEL")} />
    <ButtonSetting label={t("SETTINGS_OTHER_BLACKLIST_FOLDER_LABEL")} description={t("SETTINGS_OTHER_BLACKLIST_FOLDER_DESC")} icon={VisibilityOff} on:click={() => $showBlacklistFolders = true} />
    <SettingSection label={t("SETTINGS_OTHER_ADVANCED_LABEL")} />
    <SliderSetting label={t("SETTINGS_OTHER_MAX_LENGTH_LABEL")} description={t("SETTINGS_OTHER_MAX_LENGTH_DESC")} max={60} bind:value={$filterSongDuration} />
    <ButtonSetting label={t("SETTINGS_OTHER_CHANGE_LANGUAGE_LABEL")} description={getLanguage($selectedLanguage)} icon={Language} on:click={() => $showSelectLanguage = true} />
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