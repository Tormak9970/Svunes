<script lang="ts">
  import { DialogController, SettingsController } from "@controllers";
  import * as dialog from "@tauri-apps/plugin-dialog";
  import * as process from "@tauri-apps/plugin-process";
  import { pop } from "svelte-spa-router";

  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  
  import { AppShortcut, Download, RestartAlt } from "@icons";
  import { t } from "@stores/Locale";
  
  /**
   * Prompts the user to select a backup file.
   */
  async function pickBackup() {
    const path = await dialog.open({
      title: $t("CHOOSE_BACKUP_MESSAGE"),
      directory: false,
      multiple: false,
      filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });

    if (path && path !== "") {
      await SettingsController.applyBackup(path);
      DialogController.message($t("SVUNES_RESTART_TITLE"), $t("SVUNES_RESTART_MESSAGE"), $t("OK_ACTION")).then(() => {
        process.relaunch();
      });
    }
  }

  /**
   * Prompts the user to make a backup of their settings.
   */
  async function makeBackup() {
    const path = await dialog.save({
      title: $t("CHOOSE_BACKUP_MESSAGE"),
      filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });

    if (path && path !== "") {
      await SettingsController.saveSettingsToFile(path as string);
    }
  }

  /** 
   * Prompts the user to reset their settings.
   */
  async function resetSettings() {
    DialogController.ask($t("RESET_CONFIRM_TITLE"), $t("RESTART_CONFIRM_MESSAGE"), $t("YES_ACTION"), $t("NO_ACTION")).then(async (shouldProceed: boolean) => {
      if (shouldProceed) {
        await SettingsController.resetSettings();
        DialogController.message($t("SVUNES_RESTART_TITLE"), $t("SVUNES_RESTART_MESSAGE"), $t("OK_ACTION")).then(() => {
          process.relaunch();
        });
      }
    });
  }
</script>

<SettingsBody>
  <span slot="header">
    <SettingsHeader label={$t("SETTINGS_BACKUP_TITLE")} goBack={pop} />
  </span>
  <span slot="content">
    <ButtonSetting label={$t("SETTINGS_BACKUP_DESC")} description={$t("SETTINGS_BACKUP_DESC")} icon={AppShortcut} on:click={makeBackup} />
    <ButtonSetting label={$t("SETTINGS_RESTORE_LABEL")} description={$t("SETTINGS_RESTORE_DESC")} icon={Download} on:click={pickBackup} />
    <ButtonSetting label={$t("SETTINGS_RESET_LABEL")} description={$t("SETTINGS_RESET_DESC")} icon={RestartAlt} on:click={resetSettings} />
  </span>
</SettingsBody>