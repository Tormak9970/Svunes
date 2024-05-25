<script lang="ts">
  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import { pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { isSwitchingView, lastView, selectedView } from "../../stores/State";
  import SettingsNavButton from "../../components/views/settings/SettingsNavButton.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  
  import Palette from "@ktibow/iconset-material-symbols/palette";
  import NowPlaying from "@ktibow/iconset-material-symbols/play-circle-outline-rounded";
  import Personalize from "@ktibow/iconset-material-symbols/hdr-weak";
  import Audio from "@ktibow/iconset-material-symbols/volume-up-rounded";
  import Other from "@ktibow/iconset-material-symbols/tune-rounded";
  import Backup from "@ktibow/iconset-material-symbols/history-rounded";
  import About from "@ktibow/iconset-material-symbols/info-outline-rounded";

  function goBack() {
    $selectedView = $lastView!;
    pop();
  }

  onMount(() => {
    $isSwitchingView = false;
  });
</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="Settings" goBack={goBack} />
  </span>
  <span class="content" slot="content">
    <SettingsNavButton label="Appearance" description="Customize the look of the app" route="/settings/appearance" icon={Palette} color="#42a5f5" />
    <SettingsNavButton label="Now Playing" description="Customize the now playing screen" route="/settings/now-playing" icon={NowPlaying} color="#ef5350" />
    <SettingsNavButton label="Personalize" description="Change the layout and controls of the app" route="/settings/personalize" icon={Personalize} color="#66bb6a" />
    <SettingsNavButton label="Audio" description="Audio playback settings" route="/settings/audio" icon={Audio} color="#7e57c2" />
    <SettingsNavButton label="Other" description="Hide songs, change language, and more" route="/settings/other" icon={Other} color="#FFA726" />
    <SettingsNavButton label="Backup & Restore" description="Backup, restore & reset your settings" route="/settings/backup" icon={Backup} color="#26C6DA" />
    <SettingsNavButton label="About" description="Info about the app and developers" route="/settings/about" icon={About} color="#D4E157" />
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