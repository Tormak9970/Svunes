<script lang="ts">
  import LoadingSpinner from "@layout/loading-animations/LoadingSpinner.svelte";
  import ModalBody from "./utils/ModalBody.svelte";
</script>

<ModalBody open headline="" canClose={false}>
  <div style="display: flex; width: 100%; align-items: center; gap: 20px">
    <LoadingSpinner /> <div style="font-size: 20px;">Saving Settings</div>
  </div>
</ModalBody>