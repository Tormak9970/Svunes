<script lang="ts">
  import { showSavingSettings } from "../../stores/Modals";
  import ModalBody from "./utils/ModalBody.svelte";
  import LoadingSpinner from "../layout/loading-animations/LoadingSpinner.svelte";
</script>

<ModalBody show={$showSavingSettings} headline={""} onClose={() => {}}>
  <div slot="content" style="display: flex; width: 100%; align-items: center; gap: 20px">
    <LoadingSpinner /> <div style="font-size: 20px;">Saving Settings</div>
  </div>
</ModalBody>