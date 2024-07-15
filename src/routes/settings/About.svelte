<script lang="ts">
  import { open } from "@tauri-apps/api/shell";
  import { pop } from "svelte-spa-router";

  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  import TextSetting from "@views/settings/entries/TextSetting.svelte";
  
  import BugReport from "@ktibow/iconset-material-symbols/bug-report-outline-rounded";
  import EditDocument from "@ktibow/iconset-material-symbols/edit-document-rounded";
  import Help from "@ktibow/iconset-material-symbols/help-rounded";
  import Version from "@ktibow/iconset-material-symbols/info-outline-rounded";
  import License from "@ktibow/iconset-material-symbols/license-outline-rounded";
  import Person from "@ktibow/iconset-material-symbols/person-rounded";
  import Star from "@ktibow/iconset-material-symbols/star-rounded";
  import Translate from "@ktibow/iconset-material-symbols/translate-rounded";
  import t from "@lib/utils/i18n";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label={t("SETTINGS_ABOUT_TITLE")} goBack={pop} />
  </span>
  <span class="content" slot="content">
    <!-- svelte-ignore missing-declaration -->
    <TextSetting label={t("SETTINGS_ABOUT_VERSION_LABEL")} description={APP_VERSION} icon={Version} />
    <TextSetting label={t("SETTINGS_ABOUT_DEV_LABEL")} description="Travis Lane" icon={Person} />
    <ButtonSetting label={t("SETTINGS_ABOUT_CHANGELOG_LABEL")} description={t("SETTINGS_ABOUT_CHANGELOG_DESC")} icon={EditDocument} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/CHANGELOG.md")} />
    <ButtonSetting label={t("SETTINGS_ABOUT_GITHUB_LABEL")} description={t("SETTINGS_ABOUT_GITHUB_LABEL")} icon={Star} on:click={() => open("https://github.com/Tormak9970/Tunistic")} />
    <ButtonSetting label={t("SETTINGS_ABOUT_TRANSLATE_LABEL")} description={t("SETTINGS_ABOUT_TRANSLATE_LABEL")} icon={Translate} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/Translate.md")} />
    <ButtonSetting label={t("SETTINGS_ABOUT_BUG_REPORT_LABEL")} description={t("SETTINGS_ABOUT_BUG_REPORT_LABEL")} icon={BugReport} on:click={() => open("https://github.com/Tormak9970/Tunistic/issues/new/choose")} />
    <ButtonSetting label={t("SETTINGS_ABOUT_FAQ_LABEL")} description={t("SETTINGS_ABOUT_FAQ_LABEL")} icon={Help} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/FAQ.md")} />
    <ButtonSetting label={t("SETTINGS_ABOUT_LICENSING_LABEL")} description={t("SETTINGS_ABOUT_LICENSING_LABEL")} icon={License} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/LICENSE")} />
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