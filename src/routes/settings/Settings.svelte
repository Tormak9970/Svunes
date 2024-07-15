<script lang="ts">
  import { isSwitchingView, lastView, selectedView } from "@stores/State";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import SettingsNavButton from "@views/settings/SettingsNavButton.svelte";
  import { onMount } from "svelte";
  import { pop } from "svelte-spa-router";
  
  import Personalize from "@ktibow/iconset-material-symbols/hdr-weak";
  import Backup from "@ktibow/iconset-material-symbols/history-rounded";
  import About from "@ktibow/iconset-material-symbols/info-outline-rounded";
  import Palette from "@ktibow/iconset-material-symbols/palette";
  import NowPlaying from "@ktibow/iconset-material-symbols/play-circle-outline-rounded";
  import Other from "@ktibow/iconset-material-symbols/tune-rounded";
  import Audio from "@ktibow/iconset-material-symbols/volume-up-rounded";
  import { t } from "@stores/Locale";

  function goBack() {
    $selectedView = $lastView!;
    pop();
  }

  onMount(() => {
    $isSwitchingView = false;
  });
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label={$t("SETTINGS_TITLE")} goBack={goBack} />
  </span>
  <span class="content" slot="content">
    <SettingsNavButton label={$t("SETTINGS_APPEARANCE_TITLE")} description={$t("SETTINGS_APPEARANCE_PAGE_DESC")} route="/settings/appearance" icon={Palette} color="#42a5f5" />
    <SettingsNavButton label={$t("SETTINGS_NOW_PLAYING_TITLE")} description={$t("SETTINGS_NOW_PLAYING_PAGE_DESC")} route="/settings/now-playing" icon={NowPlaying} color="#ef5350" />
    <SettingsNavButton label={$t("SETTINGS_PERSONALIZE_TITLE")} description={$t("SETTINGS_PERSONALIZE_PAGE_DESC")} route="/settings/personalize" icon={Personalize} color="#66bb6a" />
    <SettingsNavButton label={$t("SETTINGS_AUDIO_TITLE")} description={$t("SETTINGS_AUDIO_PAGE_DESC")} route="/settings/audio" icon={Audio} color="#7e57c2" />
    <SettingsNavButton label={$t("SETTINGS_OTHER_TITLE")} description={$t("SETTINGS_OTHER_PAGE_DESC")} route="/settings/other" icon={Other} color="#FFA726" />
    <SettingsNavButton label={$t("SETTINGS_BACKUP_TITLE")} description={$t("SETTINGS_BACKUP_PAGE_DESC")} route="/settings/backup" icon={Backup} color="#26C6DA" />
    <SettingsNavButton label={$t("SETTINGS_ABOUT_TITLE")} description={$t("SETTINGS_ABOUT_PAGE_DESC")} route="/settings/about" icon={About} color="#D4E157" />
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