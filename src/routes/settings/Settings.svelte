<script lang="ts">
  import { isSwitchingView, lastView, selectedView } from "@stores/State";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import SettingsNavButton from "@views/settings/SettingsNavButton.svelte";
  import { onMount } from "svelte";
  import { pop } from "svelte-spa-router";
  
  import { History, InfoOutline, Palette, Personalize, PlayCircle, Translate, Tune, VolumeUp } from "@icons";
  import { isLandscape } from "@stores/Layout";
  import { t } from "@stores/Locale";

  function goBack() {
    $selectedView = $lastView!;
    pop();
  }

  onMount(() => {
    $isSwitchingView = false;
  });
</script>

<SettingsBody>
  <span slot="header">
    <SettingsHeader label={$t("SETTINGS_TITLE")} goBack={goBack} />
  </span>
  <span slot="content">
    <SettingsNavButton label={$t("SETTINGS_APPEARANCE_TITLE")} description={$t("SETTINGS_APPEARANCE_PAGE_DESC")} route="/settings/appearance" icon={Palette} color="#42a5f5" />
    {#if !$isLandscape}
      <SettingsNavButton label={$t("SETTINGS_NOW_PLAYING_TITLE")} description={$t("SETTINGS_NOW_PLAYING_PAGE_DESC")} route="/settings/now-playing" icon={PlayCircle} color="#ef5350" />
    {/if}
    <SettingsNavButton label={$t("SETTINGS_PERSONALIZE_TITLE")} description={$t("SETTINGS_PERSONALIZE_PAGE_DESC")} route="/settings/personalize" icon={Personalize} color="#66bb6a" />
    <SettingsNavButton label={$t("SETTINGS_AUDIO_TITLE")} description={$t("SETTINGS_AUDIO_PAGE_DESC")} route="/settings/audio" icon={VolumeUp} color="#7e57c2" />
    <SettingsNavButton label={$t("SETTINGS_SONG_FILTERING_TITLE")} description={$t("SETTINGS_SONG_FILTERING_PAGE_DESC")} route="/settings/song-filtering" icon={Tune} color="#FFA726" />
    <SettingsNavButton label={$t("SETTINGS_LANGUAGE_TITLE")} description={$t("SETTINGS_LANGUAGE_PAGE_DESC")} route="/settings/language" icon={Translate} color="#26C6DA" />
    <SettingsNavButton label={$t("SETTINGS_BACKUP_TITLE")} description={$t("SETTINGS_BACKUP_PAGE_DESC")} route="/settings/backup" icon={History} color="#57c292" />
    <SettingsNavButton label={$t("SETTINGS_ABOUT_TITLE")} description={$t("SETTINGS_ABOUT_PAGE_DESC")} route="/settings/about" icon={InfoOutline} color="#D4E157" />
  </span>
</SettingsBody>