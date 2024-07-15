<script lang="ts">
  import { SettingsController } from "@lib/controllers/SettingsController";
  import { DialogController } from "@lib/controllers/utils/DialogController";
  import { dialog, process } from "@tauri-apps/api";
  import { pop } from "svelte-spa-router";

  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  
  import AppShortcut from "@ktibow/iconset-material-symbols/app-shortcut-rounded";
  import Download from "@ktibow/iconset-material-symbols/download-rounded";
  import RestartAlt from "@ktibow/iconset-material-symbols/restart-alt-rounded";
  import t from "@lib/utils/i18n";
  
  /**
   * Prompts the user to select a backup file.
   */
   async function pickBackup() {
    const path = await dialog.open({
      title: t("CHOOSE_BACKUP_MESSAGE"),
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
      await SettingsController.applyBackup(path as string);
      DialogController.message(t("TUNISTIC_RESTART_TITLE"), t("TUNISTIC_RESTART_MESSAGE"), t("OK_ACTION")).then(() => {
        process.relaunch();
      });
    }
  }

  /**
   * Prompts the user to make a backup of their settings.
   */
  async function makeBackup() {
    const path = await dialog.save({
      title: t("CHOOSE_BACKUP_MESSAGE"),
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
    DialogController.ask(t("RESET_CONFIRM_TITLE"), t("RESTART_CONFIRM_MESSAGE"), t("YES_ACTION"), t("NO_ACTION")).then(async (shouldProceed: boolean) => {
      if (shouldProceed) {
        await SettingsController.resetSettings();
        DialogController.message(t("TUNISTIC_RESTART_TITLE"), t("TUNISTIC_RESTART_MESSAGE"), t("OK_ACTION")).then(() => {
          process.relaunch();
        });
      }
    });
  }
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label={t("SETTINGS_BACKUP_TITLE")} goBack={pop} />
  </span>
  <span class="content" slot="content">
    <ButtonSetting label={t("SETTINGS_BACKUP_DESC")} description={t("SETTINGS_BACKUP_DESC")} icon={AppShortcut} on:click={makeBackup} />
    <ButtonSetting label={t("SETTINGS_RESTORE_LABEL")} description={t("SETTINGS_RESTORE_DESC")} icon={Download} on:click={pickBackup} />
    <ButtonSetting label={t("SETTINGS_RESET_LABEL")} description={t("SETTINGS_RESET_DESC")} icon={RestartAlt} on:click={resetSettings} />
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