<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { dialogModalCancel, dialogModalCancelText, dialogModalConfirm, dialogModalConfirmText, dialogModalMessage, dialogModalTitle, showDialogModal } from "@stores/Modals";
  import ModalBody from "./utils/ModalBody.svelte";

  /**
   * Function to run on confirmation.
   */
  async function onConfirm(): Promise<void> {
    await $dialogModalConfirm();
    $showDialogModal = false;
  }

  /**
   * Function to run on cancel.
   */
  async function onCancel(): Promise<void> {
    await $dialogModalCancel();
    $showDialogModal = false;
  }
</script>

<ModalBody headline={$dialogModalTitle} bind:open={$showDialogModal} canClose={false} on:close={() => {}}>
  <div class="content">
    {$dialogModalMessage}
  </div>
  <div slot="buttons" class="buttons">
    {#if $dialogModalConfirmText !== ""}
      <Button type="text" on:click={onConfirm}>{$dialogModalConfirmText}</Button>
    {/if}
    {#if $dialogModalCancelText !== ""}
      <Button type="text" on:click={onCancel}>{$dialogModalCancelText}</Button>
    {/if}
  </div>
</ModalBody>

<style>
  .content {
    max-width: 300px;
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 20px;
  }
</style>
