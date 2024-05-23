<script lang="ts">
  import { pop } from "svelte-spa-router";
  import { palette, themePrimaryColor, useOledPalette } from "../../stores/State";
  import type { Palette } from "../../types/Settings";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import SettingSection from "../../components/views/settings/SettingSection.svelte";
  import ColorSetting from "../../components/views/settings/entries/ColorSetting.svelte";
  import ToggleSetting from "../../components/views/settings/entries/ToggleSetting.svelte";
  import MultiButtonSetting from "../../components/views/settings/entries/MultiButtonSetting.svelte";
  import MultiButton from "../../components/interactables/multi-button/MultiButton.svelte";
  import ColorPreset from "../../components/views/settings/ColorPreset.svelte";
  
  import Theme from "@ktibow/iconset-material-symbols/palette";
  import Auto from "@ktibow/iconset-material-symbols/brightness-medium-rounded";
  import Dark from "@ktibow/iconset-material-symbols/dark-mode-rounded";
  import Light from "@ktibow/iconset-material-symbols/light-mode-rounded";
  
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
    <SettingsHeader label="Appearance" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <SettingSection label="Theme" />
    <ColorSetting icon={Theme} label="App Theme" description="Customize the color palette of the app" bind:color={$themePrimaryColor} />
    <div class="color-presets">
      <ColorPreset hex="#51dd28" on:click={() => setThemeColor("#51dd28")} />
      <ColorPreset hex="#dd5527" on:click={() => setThemeColor("#dd5527")} />
      <ColorPreset hex="#4f5add" on:click={() => setThemeColor("#4f5add")} />
      <ColorPreset hex="#a74bf2" on:click={() => setThemeColor("#a74bf2")} />
      <ColorPreset hex="#ffd28d" on:click={() => setThemeColor("#ffd28d")} />
    </div>
    <SettingSection label="Palette" />
    <MultiButtonSetting label="Palette" description="Choose the palette for the theme">
      <MultiButton name="theme-palette" id="auto" icon={Auto} checked={$palette === "Auto"} on:input={() => setPalette("Auto")}>Auto</MultiButton>
      <MultiButton name="theme-palette" id="dark" icon={Dark} checked={$palette === "Dark"} on:input={() => setPalette("Dark")}>Dark</MultiButton>
      <MultiButton name="theme-palette" id="light" icon={Light} checked={$palette === "Light"} on:input={() => setPalette("Light")}>Light</MultiButton>
    </MultiButtonSetting>
    <ToggleSetting label="OLED Dark" description="Use an all black theme for the app" bind:checked={$useOledPalette} />
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

    height: 25px;
  }
</style>