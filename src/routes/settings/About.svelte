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
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="About" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <!-- svelte-ignore missing-declaration -->
    <TextSetting label="Version" description={APP_VERSION} icon={Version} />
    <TextSetting label="Developer" description="Travis Lane" icon={Person} />
    <ButtonSetting label="View Changelog" description="View the changes made in each release" icon={EditDocument} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/CHANGELOG.md")} />
    <ButtonSetting label="GitHub" description="View the app's source and star it!" icon={Star} on:click={() => open("https://github.com/Tormak9970/Tunistic")} />
    <ButtonSetting label="Translate" description="Help translate the app into your language" icon={Translate} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/Translate.md")} />
    <ButtonSetting label="Report a Bug" description="Ran into an issue? Let me know!" icon={BugReport} on:click={() => open("https://github.com/Tormak9970/Tunistic/issues/new/choose")} />
    <ButtonSetting label="FAQ" description="Get answers to common questions" icon={Help} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/FAQ.md")} />
    <ButtonSetting label="Licensing" description="GPL v3.0" icon={License} on:click={() => open("https://github.com/Tormak9970/Tunistic/blob/main/LICENSE")} />
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