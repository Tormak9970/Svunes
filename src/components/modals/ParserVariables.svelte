<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { t } from "@stores/Locale";
  import { showParserVariables } from "@stores/Modals";
  import ModalBody from "./utils/ModalBody.svelte";

  let open = true;
</script>

<ModalBody headline={$t("PARSER_VARIABLES_TITLE")} open={open} on:close={() => open = false} on:closeEnd={() => $showParserVariables = false }>
  <div class="content">
    <div>{$t("PARSER_PLACEHOLDER_VARIABLE_USE")}.<br/>%dummy% {$t("PARSER_PLACEHOLDER_CAVEAT")}.</div>
    <div><b>%title%</b> - {$t("PARSER_TITLE_DEFINITION")}</div>
    <div><b>%album%</b> - {$t("PARSER_ALBUM_DEFINITION")}</div>
    <div><b>%track%</b> - {$t("PARSER_NUMBER_DEFINITION")}</div>
    <div><b>%artist%</b> - {$t("PARSER_ARTIST_DEFINITION")}</div>
    <div><b>%albumartist%</b> - {$t("PARSER_ALBUM_ARTIST_DEFINITION")}</div>
    <div><b>%genre%</b> - {$t("PARSER_GENRE_DEFINITION")}</div>
    <div><b>%year%</b> - {$t("PARSER_RELEASE_YEAR_DEFINITION")}</div>
    <div><b>%dummy%</b> - {$t("PARSER_PLACEHOLDER_DEFINITION")}</div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={() => open = false }>{$t("CLOSE_ACTION")}</Button>
    </div>
  </div>
</ModalBody>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    font-size: 16px;
  }
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>