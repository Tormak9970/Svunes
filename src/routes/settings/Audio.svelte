<script lang="ts">
  import { t } from "@stores/Locale";
  import { showManageEqs } from "@stores/Modals";
  import { autoPlayOnConnect, equalizers, selectedEq } from "@stores/State";
  import { pop } from "svelte-spa-router";

  import { SectionLabel } from "@layout";
  import SettingsBody from "@views/settings/SettingsBody.svelte";
  import SettingsHeader from "@views/settings/SettingsHeader.svelte";
  import ButtonSetting from "@views/settings/entries/ButtonSetting.svelte";
  import SelectSetting from "@views/settings/entries/SelectSetting.svelte";
  import ToggleSetting from "@views/settings/entries/ToggleSetting.svelte";
  
  import { EditAudio, GraphEq, WiredAuto } from "@icons";

  $: eqNames = Object.keys($equalizers);
  $: eqOptions = eqNames.map((eq) => {
    return {
      label: eq,
      value: eq
    };
  });
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label={$t("SETTINGS_AUDIO_TITLE")} goBack={pop} />
  </span>
  <span class="content" slot="content">
    <!-- Gapless playback? -->
    <SectionLabel label={$t("SETTINGS_AUDIO_AUTO_PLAY_LABEL")} />
    <ToggleSetting label={$t("SETTINGS_AUDIO_CONNECTIONS_LABEL")} description={$t("SETTINGS_AUDIO_CONNECTIONS_DESC")} icon={WiredAuto} bind:checked={$autoPlayOnConnect} />
    <!-- <ToggleSetting label={$t("SETTINGS_AUDIO_CONNECTIONS_LABEL")} description={$t("SETTINGS_AUDIO_CONNECTIONS_DESC")} icon={WiredAuto} bind:checked={$autoPlayOnConnect} /> -->
    <SectionLabel label={$t("SETTINGS_AUDIO_CHANNEL_BALANCE_LABEL")} />
    <!-- TODO: L/R Channel Balance -->
    <SectionLabel label={$t("SETTINGS_AUDIO_EQ_LABEL")} />
    <SelectSetting
      label={$t("SETTINGS_AUDIO_CURRENT_EQ_LABEL")}
      description={$t("SETTINGS_AUDIO_CURRENT_EQ_DESC")}
      icon={GraphEq}
      options={eqOptions}
      bind:value={$selectedEq}
    />
    <ButtonSetting label={$t("SETTINGS_AUDIO_MANAGE_EQS_LABEL")} description={$t("SETTINGS_AUDIO_MANAGE_EQS_DESC")} icon={EditAudio} on:click={() => { $showManageEqs = true }} />
    <!-- TODO: equalizer band adjustments here -->
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