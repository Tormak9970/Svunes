<script lang="ts">
  import { debugModeEnabled, palette, themePrimaryColor, useOledPalette } from "@stores/State";
  import type { Palette } from "@types";
  import { pop } from "svelte-spa-router";

  import { MultiButton } from "@interactables";
  import ColorPreset from "@views/settings/ColorPreset.svelte";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ColorSetting from "@views/settings/entries/ColorSetting.svelte";
  import MultiButtonSetting from "@views/settings/entries/MultiButtonSetting.svelte";
  import ToggleSetting from "@views/settings/entries/ToggleSetting.svelte";
  
  import { BrightnessMedium, Bug, DarkMode, LightMode, Palette as Theme } from "@icons";
  import { SectionLabel } from "@layout";
  import { t } from "@stores/Locale";
  
  /**
   * Sets the theme's palette.
   * @param newPalette The new palette to use.
   */
  function setPalette(newPalette: Palette) {
    $palette = newPalette;
  }

  /**
   * Sets the theme's primary color.
   * @param color The color to set it to, in hex.
   */
  function setThemeColor(color: string) {
    $themePrimaryColor = color;
  }
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label={$t("SETTINGS_APPEARANCE_TITLE")} goBack={pop} />
  </span>
  <span class="content" slot="content">
    <SectionLabel label={$t("SETTINGS_APPEARANCE_THEME_LABEL")} />
    <ColorSetting icon={Theme} label={$t("SETTINGS_APPEARANCE_APP_THEME_LABEL")} description={$t("SETTINGS_APPEARANCE_APP_THEME_DESC")} bind:color={$themePrimaryColor} />
    <div class="color-presets">
      <ColorPreset hex="#51dd28" on:click={() => setThemeColor("#51dd28")} />
      <ColorPreset hex="#dd5527" on:click={() => setThemeColor("#dd5527")} />
      <ColorPreset hex="#4f5add" on:click={() => setThemeColor("#4f5add")} />
      <ColorPreset hex="#a74bf2" on:click={() => setThemeColor("#a74bf2")} />
      <ColorPreset hex="#ffd28d" on:click={() => setThemeColor("#ffd28d")} />
    </div>
    <SectionLabel label={$t("SETTINGS_APPEARANCE_PALETTE_LABEL")} />
    <MultiButtonSetting label={$t("SETTINGS_APPEARANCE_PALETTE_LABEL")} description={$t("SETTINGS_APPEARANCE_PALETTE_DESC")}>
      <MultiButton name="theme-palette" id="auto" icon={BrightnessMedium} checked={$palette === "Auto"} on:input={() => setPalette("Auto")}>{$t("SETTINGS_APPEARANCE_PALETTE_AUTO")}</MultiButton>
      <MultiButton name="theme-palette" id="dark" icon={DarkMode} checked={$palette === "Dark"} on:input={() => setPalette("Dark")}>{$t("SETTINGS_APPEARANCE_PALETTE_DARK")}</MultiButton>
      <MultiButton name="theme-palette" id="light" icon={LightMode} checked={$palette === "Light"} on:input={() => setPalette("Light")}>{$t("SETTINGS_APPEARANCE_PALETTE_LIGHT")}</MultiButton>
    </MultiButtonSetting>
    <ToggleSetting label={$t("SETTINGS_APPEARANCE_OLED_LABEL")} description={$t("SETTINGS_APPEARANCE_OLED_DESC")} bind:checked={$useOledPalette} />
    <!-- svelte-ignore missing-declaration -->
    {#if !IS_MOBILE}
      <ToggleSetting icon={Bug} label={$t("SETTINGS_APPEARANCE_DEBUG_LABEL")} description={$t("SETTINGS_APPEARANCE_DEBUG_DESC")} bind:checked={$debugModeEnabled} />
    {/if}
  </span>
</SettingsBody>

<style>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .color-presets {
    width: calc(100% - 65px);
    margin-left: 65px;
    display: flex;
    align-items: center;
    gap: 10px;

    height: 30px;
  }
</style>