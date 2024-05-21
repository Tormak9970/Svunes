<script lang="ts">
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import { Button, Icon } from "m3-svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import { pop } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { isSwitchingView } from "../../stores/State";


  onMount(() => {
    $isSwitchingView = false;
  });
</script>

<SettingsBody>
  <span slot="header">
    <OverlayHeader highlight={false}>
      <span slot="left" style="display: flex; align-items: center;">
        <Button type="text" iconType="full" on:click={pop}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="margin-left: 10px; font-size: 20px;">Settings</div>
      </span>
      <span slot="right" />
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    
  </span>
</SettingsBody>

<style>

</style>