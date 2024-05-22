<script lang="ts">
  import SettingsBody from "../../components/views/settings/SettingsBody.svelte";
  import SettingsHeader from "../../components/views/settings/SettingsHeader.svelte";
  import { pop } from "svelte-spa-router";

</script>

<SettingsBody>
  <span slot="header" style="height: 50px;">
    <SettingsHeader label="About" goBack={pop} />
  </span>
  <span class="content" slot="content">
    
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