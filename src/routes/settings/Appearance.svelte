<script lang="ts">
  import { pop } from "svelte-spa-router";
    import { themePrimaryColor } from "../../stores/State";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import SettingSection from "../../components/views/settings/SettingSection.svelte";
  import ColorSetting from "../../components/views/settings/entries/ColorSetting.svelte";
  import ToggleSetting from "../../components/views/settings/entries/ToggleSetting.svelte";
  import ButtonSetting from "../../components/views/settings/entries/ButtonSetting.svelte";
  
  import Version from "@ktibow/iconset-material-symbols/info-outline-rounded";
  import Person from "@ktibow/iconset-material-symbols/person-rounded";
  import EditDocument from "@ktibow/iconset-material-symbols/edit-document-rounded";
  import Star from "@ktibow/iconset-material-symbols/star-rounded";
  import Translate from "@ktibow/iconset-material-symbols/translate-rounded";
  import BugReport from "@ktibow/iconset-material-symbols/bug-report-outline-rounded";
  import Help from "@ktibow/iconset-material-symbols/help-rounded";
  import License from "@ktibow/iconset-material-symbols/license-outline-rounded";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Appearance" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <SettingSection label="THEME" />
    <ColorSetting label="App Theme" description="Customize the color palette of the app" bind:color={$themePrimaryColor} />
    <ToggleSetting label="OLED Black" description="Use an all black theme for the app" checked={false} />
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