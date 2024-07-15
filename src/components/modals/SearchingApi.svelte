<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import LoadingSpinner from "@layout/loading-animations/LoadingSpinner.svelte";
  import t from "@lib/utils/i18n";
  import { apiSearchCanceled, showSearchingApi } from "@stores/Modals";
  import ModalBody from "./utils/ModalBody.svelte";

  function cancel() {
    $apiSearchCanceled = true;
    $showSearchingApi = false;
  }
</script>

<ModalBody open headline="" canClose={false}>
  <div style="display: flex; width: 100%; align-items: center; gap: 20px">
    <LoadingSpinner /> <div style="font-size: 20px;">{t("SEARCHING_MESSAGE")}...</div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={cancel}>{t("CANCEL_ACTION")}</Button>
    </div>
  </div>
</ModalBody>