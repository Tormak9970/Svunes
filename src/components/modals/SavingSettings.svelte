<script lang="ts">
  import LoadingSpinner from "@layout/loading-animations/LoadingSpinner.svelte";
  import { showSavingSettings } from "@stores/Modals";
  import ModalBody from "./utils/ModalBody.svelte";
</script>

<ModalBody bind:open={$showSavingSettings} headline="">
  <div style="display: flex; width: 100%; align-items: center; gap: 20px">
    <LoadingSpinner /> <div style="font-size: 20px;">Saving Settings</div>
  </div>
</ModalBody>