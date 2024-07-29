<script lang="ts">
  import { ModalBody } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import { HELP_TRANSLATE_LINK, t } from "@stores/Locale";
  import { showParserVariables } from "@stores/Modals";
  import * as shell from "@tauri-apps/plugin-shell";

  let modalOpen = true;
</script>

<ModalBody headline={$t("HELP_TRANSLATE_TITLE")} open={modalOpen} on:close={() => modalOpen = false} on:closeEnd={() => $showParserVariables = false }>
  <div class="content">
    {$t("HELP_TRANSLATE_MESSAGE")}.
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={() => modalOpen = false }>{$t("CLOSE_ACTION")}</Button>
      <Button type="text" on:click={() => shell.open(HELP_TRANSLATE_LINK) }>{$t("HELP_ACTION")}</Button>
    </div>
  </div>
</ModalBody>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    font-size: 1rem;

    max-width: 20rem;
  }
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>