<script lang="ts">
  import { ModalBody } from "@component-utils";
  import { Button } from "@interactables";
  import { controlledModalCancel, controlledModalCancelText, controlledModalConfirm, controlledModalConfirmText, controlledModalMessage, controlledModalTitle, showControlledModal } from "@stores/Modals";

  let open = true;

  /**
   * Function to run on confirmation.
   */
  async function onConfirm(): Promise<void> {
    await $controlledModalConfirm();
    open = false;
  }

  /**
   * Function to run on cancel.
   */
  async function onCancel(): Promise<void> {
    await $controlledModalCancel();
    open = false;
  }
</script>

<ModalBody headline={$controlledModalTitle} open={open} canClose={false} on:closeEnd={() => { $showControlledModal = false }}>
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
