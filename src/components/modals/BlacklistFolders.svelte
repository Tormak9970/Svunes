<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { t } from "@stores/Locale";
  import { showBlacklistFolders } from "@stores/Modals";
  import { blacklistedFolders } from "@stores/State";
  import * as dialog from "@tauri-apps/plugin-dialog";
  import FolderEntry from "./utils/FolderEntry.svelte";
  import ModalBody from "./utils/ModalBody.svelte";

  let open = true;

  let folders = [ ...$blacklistedFolders ];

  /**
   * Prompts the user to select a folder.
   */
  async function pickFolders() {
    const path = await dialog.open({
      title: $t("CHOOSE_FOLDER_MESSAGE"),
      directory: true,
      multiple: false
    });

    if (path && path !== "") {
      folders = [ ...folders, (path as string) ];
    }
  }

  /**
   * Clears the blacklist.
   */
  function clear() {
    $blacklistedFolders = [];
  }

  /**
   * Saves the user's changes
   */
  function done() {
    $blacklistedFolders = [ ...folders ];
    open = false;
  }

  /**
   * Handles removing a path.
   * @param index The index of the path to remove.
   */
  function onPathDelete(index: number) {
    folders.splice(index, 1);
    folders = [ ...folders ];
  }
</script>

<ModalBody open={open} headline={$t("BLACKLISTED_TITLE")} on:close={() => open = false} on:closeEnd={() => $showBlacklistFolders = false }>
  <div style="width: 18rem;">
    {#each folders as directory, i}
      <FolderEntry folderPath={directory} index={i} onDelete={onPathDelete} />
    {:else}
      <div class="font-label">{$t("NO_BLACKLISTED_MESSAGE")}</div>
    {/each}
  </div>
  <div class="actions" slot="buttons">
    <div class="left">
      <Button type="text" on:click={clear}>{$t("CLEAR_ACTION")}</Button>
    </div>
    <div class="right">
      <Button type="text" on:click={pickFolders}>{$t("ADD_ACTION")}</Button>
      <Button type="text" on:click={done}>{$t("DONE_ACTION")}</Button>
    </div>
  </div>
</ModalBody>

<style>
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .left {
    margin-right: 65px;
  }
</style>