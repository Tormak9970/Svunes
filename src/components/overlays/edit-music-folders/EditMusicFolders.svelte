<script lang="ts">
  import { dialog } from "@tauri-apps/api";
  import { showEditMusicFolders } from "../../../stores/Overlays";
  import { musicDirectories } from "../../../stores/State";
  import OverlayBody from "../OverlayBody.svelte";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import FolderEntry from "./FolderEntry.svelte";

  let musicDirectoriesUnsub: Unsubscriber;

  let folders = [ ...$musicDirectories ];

  let closeOverlay: () => void;

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

  function done() {
    $musicDirectories = [ ...folders ];
    closeOverlay();
  }

  function onPathDelete(index: number) {
    folders.splice(index, 1);
    folders = [ ...folders ];
  }

  onMount(() => {
    musicDirectoriesUnsub = musicDirectories.subscribe((dirs) => {
      folders = dirs;
    });
  });

  onDestroy(() => {
    if (musicDirectoriesUnsub) musicDirectoriesUnsub();
  });
</script>

<OverlayBody show={$showEditMusicFolders} bind:close={closeOverlay}>
  <div slot="header">Music Folders</div>
  <div slot="content">
    {#each folders as directory, i}
      <FolderEntry folderPath={directory} index={i} onDelete={onPathDelete} />
    {:else}
      <div>You haven't chosen any folders</div>
    {/each}
  </div>
  <div class="actions" slot="actions">
    <div class="left">
      
    </div>
    <div class="right">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <md-text-button on:click={pickFolders}>Add</md-text-button>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <md-text-button on:click={done}>Done</md-text-button>
    </div>
  </div>
</OverlayBody>

<style>
  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>