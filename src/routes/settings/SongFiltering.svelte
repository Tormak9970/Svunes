<script lang="ts">
  import { showBlacklistFolders, showEditMusicFolders } from "@stores/Modals";
  import { filterSongDuration } from "@stores/State";
  import { pop } from "svelte-spa-router";

  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  import SliderSetting from "@views/settings/entries/SliderSetting.svelte";
  
  import { FolderOpen, VisibilityOff } from "@icons";
  import { SectionLabel } from "@layout";
  import { t } from "@stores/Locale";
</script>

<SettingsBody>
  <span slot="header">
    <SettingsHeader label={$t("SETTINGS_SONG_FILTERING_TITLE")} goBack={pop} />
  </span>
  <span slot="content">
    <ButtonSetting label={$t("SETTINGS_SONG_FILTERING_MUSIC_FOLDER_LABEL")} description={$t("SETTINGS_SONG_FILTERING_MUSIC_FOLDER_DESC")} icon={FolderOpen} on:click={() => $showEditMusicFolders = true} />
    <SectionLabel label={$t("SETTINGS_SONG_FILTERING_BLACKLIST_LABEL")} />
    <ButtonSetting label={$t("SETTINGS_SONG_FILTERING_BLACKLIST_FOLDER_LABEL")} description={$t("SETTINGS_SONG_FILTERING_BLACKLIST_FOLDER_DESC")} icon={VisibilityOff} on:click={() => $showBlacklistFolders = true} />
    <SectionLabel label={$t("SETTINGS_SONG_FILTERING_ADVANCED_LABEL")} />
    <SliderSetting label={$t("SETTINGS_SONG_FILTERING_MAX_LENGTH_LABEL")} description={$t("SETTINGS_SONG_FILTERING_MAX_LENGTH_DESC")} max={60} bind:value={$filterSongDuration} />
  </span>
</SettingsBody>