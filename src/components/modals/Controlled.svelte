<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { controlledModalCancel, controlledModalCancelText, controlledModalConfirm, controlledModalConfirmText, controlledModalMessage, controlledModalTitle, showControlledModal } from "@stores/Modals";
  import ModalBody from "./utils/ModalBody.svelte";

  /**
   * Function to run on confirmation.
   */
  async function onConfirm(): Promise<void> {
    await $controlledModalConfirm();
    $showControlledModal = false;
  }

  /**
   * Function to run on cancel.
   */
  async function onCancel(): Promise<void> {
    await $controlledModalCancel();
    $showControlledModal = false;
  }
</script>

<ModalBody headline={$controlledModalTitle} open canClose={false} on:close={() => {}}>
  <div class="content">
    {$controlledModalMessage}
  </div>
  <div slot="buttons" class="buttons">
    {#if $controlledModalConfirmText !== ""}
      <Button type="text" on:click={onConfirm}>{$controlledModalConfirmText}</Button>
    {/if}
    {#if $controlledModalCancelText !== ""}
      <Button type="text" on:click={onCancel}>{$controlledModalCancelText}</Button>
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
