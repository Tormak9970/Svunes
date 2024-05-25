<script lang="ts">
  import { pop } from "svelte-spa-router";
  import { autoPlayOnBluetooth, autoPlayOnConnect } from "../../stores/State";

  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import SettingSection from "../../components/views/settings/SettingSection.svelte";
  import ToggleSetting from "../../components/views/settings/entries/ToggleSetting.svelte";
  
  import WiredAuto from "@ktibow/iconset-material-symbols/cable-rounded";
  import BluetoothAuto from "@ktibow/iconset-material-symbols/bluetooth-connected-rounded";
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Audio" goBack={pop} />
  </span>
  <span class="content" slot="content">
    <!-- Gapless playback? -->
    <SettingSection label="Auto Play" />
    <ToggleSetting label="Wired Connections" description="Automatically start playback when a wired devices is connected, and stop it when one disconnects" icon={WiredAuto} bind:checked={$autoPlayOnConnect} />
    <ToggleSetting label="Bluetooth Connections" description="Automatically start playback when a bluetooth devices is connected, and stop it when one disconnects" icon={BluetoothAuto} bind:checked={$autoPlayOnBluetooth} />
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