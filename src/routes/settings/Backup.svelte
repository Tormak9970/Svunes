<script lang="ts">
  import { dialog, process } from "@tauri-apps/api";
  import { pop } from "svelte-spa-router";
  import { SettingsController } from "../../lib/controllers/SettingsController";
  import { DialogController } from "../../lib/controllers/utils/DialogController";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import ButtonSetting from "../../components/views/settings/entries/ButtonSetting.svelte";
  
  import AppShortcut from "@ktibow/iconset-material-symbols/app-shortcut-rounded";
  import Download from "@ktibow/iconset-material-symbols/download-rounded";
  import RestartAlt from "@ktibow/iconset-material-symbols/restart-alt-rounded";
  
  /**
   * Prompts the user to select a backup file.
   */
   async function pickBackup() {
    const path = await dialog.open({
      title: "Choose a Backup",
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
      DialogController.message("Tunistic will now restart", "Tunistic needs to restart to apply your changes. Please click ok to restart.", "Ok").then(() => {
        process.relaunch();
      });
    }
  }

  /**
   * Prompts the user to make a backup of their settings.
   */
  async function makeBackup() {
    const path = await dialog.save({
      title: "Choose a Backup",
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
    DialogController.ask("Are you sure?", "Resetting your settings is irriversible! Are you sure you want to continue?", "Yes", "No").then(async (shouldProceed: boolean) => {
      if (shouldProceed) {
        await SettingsController.resetSettings();
        DialogController.message("Tunistic will now restart", "Tunistic needs to restart to apply your changes. Please click ok to restart.", "Ok").then(() => {
          process.relaunch();
        });
      }
    });
  }
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Backup & Restore" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <ButtonSetting label="Backup" description="Creates a backup of the app's settings" icon={AppShortcut} on:click={makeBackup} />
    <ButtonSetting label="Restore" description="Restore the app's settings from a backup file" icon={Download} on:click={pickBackup} />
    <ButtonSetting label="Reset Settings" description="Resets the app's settings back to default" icon={RestartAlt} on:click={resetSettings} />
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