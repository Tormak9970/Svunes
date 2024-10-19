<script lang="ts">
  import { FolderEntry, ModalBody } from "@component-utils";
  import { scrollShadow } from "@directives";
  import { Button } from "@interactables";
  import { t } from "@stores/Locale";
  import { showEditMusicFolders } from "@stores/Modals";
  import { musicDirectories } from "@stores/State";
  import * as dialog from "@tauri-apps/plugin-dialog";
  import { location } from "svelte-spa-router";

  let open = true;

  let folders = [ ...$musicDirectories ];

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
   * Saves the user's changes
   */
  function done() {
    $musicDirectories = [ ...folders ];
    open = false;
  }
  
  /**
   * Handles editing a path.
   * @param index The index of the path to edit.
   */
   async function onPathEdit(index: number) {
    const path = await dialog.open({
      title: $t("CHOOSE_FOLDER_MESSAGE"),
      directory: true,
      multiple: false,
      defaultPath: folders[index]
    });

    if (path && path !== "") {
      folders.splice(index, 1, path);
      folders = [ ...folders ];
    }
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

<ModalBody open={open} headline={$t("MUSIC_FOLDERS_TITLE")} canClose={$location.startsWith("/settings")} on:close={() => open = false} on:closeEnd={() => $showEditMusicFolders = false}>
  <div class="content styled-scrollbar" use:scrollShadow>
    <div class="content-wrapper">
      {#each folders as directory, i}
        <FolderEntry folderPath={directory} index={i} onEdit={onPathEdit} onDelete={onPathDelete} />
      {:else}
        <div class="font-label">{$t("NO_MUSIC_FOLDERS_MESSAGE")}</div>
      {/each}
    </div>
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={pickFolders}>{$t("ADD_ACTION")}</Button>
      <Button type="text" on:click={done}>{$t("DONE_ACTION")}</Button>
    </div>
  </div>
</ModalBody>

<style>
  .content {
    max-height: 20rem;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .content-wrapper {
    width: 20rem;
    height: fit-content;
  }

  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>