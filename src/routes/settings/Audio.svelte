<script lang="ts">
  import { autoPlayOnConnect } from "@stores/State";
  import { pop } from "svelte-spa-router";

  import SettingSection from "@views/settings/SettingSection.svelte";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ToggleSetting from "@views/settings/entries/ToggleSetting.svelte";
  
  import WiredAuto from "@ktibow/iconset-material-symbols/cable-rounded";
  import t from "@lib/utils/i18n";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label={t("SETTINGS_AUDIO_TITLE")} goBack={pop} />
  </span>
  <span class="content" slot="content">
    <!-- Gapless playback? -->
    <SettingSection label={t("SETTINGS_AUTO_PLAY_LABEL")} />
    <ToggleSetting label={t("SETTINGS_AUDIO_CONNECTIONS_LABEL")} description={t("SETTINGS_AUDIO_CONNECTIONS_DESC")} icon={WiredAuto} bind:checked={$autoPlayOnConnect} />
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