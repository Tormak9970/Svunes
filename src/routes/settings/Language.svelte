<script lang="ts">
  import { showSelectLanguage, showTranslationCredits } from "@stores/Modals";
  import * as shell from "@tauri-apps/plugin-shell";
  import { pop } from "svelte-spa-router";

  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  
  import { Groups, Translate, VolunteerActivism } from "@icons";
  import { getLanguageName, HELP_TRANSLATE_LINK, selectedLanguage, t } from "@stores/Locale";
</script>

<SettingsBody>
  <span slot="header">
    <SettingsHeader label={$t("SETTINGS_LANGUAGE_TITLE")} goBack={pop} />
  </span>
  <span slot="content">
    <ButtonSetting label={$t("SETTINGS_LANGUAGE_CHANGE_LABEL")} description={$getLanguageName($selectedLanguage)} icon={Translate} on:click={() => $showSelectLanguage = true} />
    <ButtonSetting label={$t("SETTINGS_LANGUAGE_TRANSLATE_LABEL")} description={$t("SETTINGS_LANGUAGE_TRANSLATE_DESC")} icon={VolunteerActivism} on:click={() => shell.open(HELP_TRANSLATE_LINK)} />
    <ButtonSetting label={$t("SETTINGS_LANGUAGE_CREDITS_LABEL")} description={$t("SETTINGS_LANGUAGE_CREDITS_DESC")} icon={Groups} on:click={() => $showTranslationCredits = true} />
  </span>
</SettingsBody>