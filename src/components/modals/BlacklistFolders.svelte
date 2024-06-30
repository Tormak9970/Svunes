<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { showBlacklistFolders } from "@stores/Modals";
  import { blacklistedFolders } from "@stores/State";
  import { dialog } from "@tauri-apps/api";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import FolderEntry from "./utils/FolderEntry.svelte";
  import ModalBody from "./utils/ModalBody.svelte";

  let blacklistedDirectoriesUnsub: Unsubscriber;

  let folders = [ ...$blacklistedFolders ];

  /**
   * Prompts the user to select a folder.
   */
  async function pickFolders() {
    const path = await dialog.open({
      title: "Choose a Folder",
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
    $showBlacklistFolders = false;
  }

  /**
   * Handles removing a path.
   * @param index The index of the path to remove.
   */
  function onPathDelete(index: number) {
    folders.splice(index, 1);
    folders = [ ...folders ];
  }

  onMount(() => {
    blacklistedDirectoriesUnsub = blacklistedFolders.subscribe((dirs) => {
      folders = dirs;
    });
  });

  onDestroy(() => {
    if (blacklistedDirectoriesUnsub) blacklistedDirectoriesUnsub();
  });
</script>

<ModalBody show={$showBlacklistFolders} headline="Blacklisted Folders" onClose={() => $showBlacklistFolders = false }>
  <div slot="content">
    {#each folders as directory, i}
      <FolderEntry folderPath={directory} index={i} onDelete={onPathDelete} />
    {:else}
      <div>You haven't blacklisted any folders</div>
    {/each}
  </div>
  <div class="actions" slot="actions">
    <div class="left">
      <Button type="text" on:click={clear}>Clear</Button>
    </div>
    <div class="right">
      <Button type="text" on:click={pickFolders}>Add</Button>
      <Button type="text" on:click={done}>Done</Button>
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