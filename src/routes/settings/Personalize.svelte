<script lang="ts">
  import { pop } from "svelte-spa-router";
  import { showEditViewOrder } from "../../stores/Modals";
  import { showSuggestions, trackHistory } from "../../stores/State";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import SettingSection from "../../components/views/settings/SettingSection.svelte";
  import ButtonSetting from "../../components/views/settings/entries/ButtonSetting.svelte";
  import ToggleSetting from "../../components/views/settings/entries/ToggleSetting.svelte";
  
  import LibraryMusic from "@ktibow/iconset-material-symbols/library-music-rounded";
  import History from "@ktibow/iconset-material-symbols/history-rounded";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Personalize" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <SettingSection label="Home" />
    <ToggleSetting label="Show Suggestions" description="Show suggested albums and artists on the home screen" bind:checked={$showSuggestions} />
    <ToggleSetting label="Track History" description="Track when songs and albums are played. Used for recents on the home page" icon={History} bind:checked={$trackHistory} />
    <SettingSection label="Library" />
    <ButtonSetting label="Library Categories" description="Customize the categories displayed and their order" icon={LibraryMusic} on:click={() => $showEditViewOrder = true} />
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