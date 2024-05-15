<script lang="ts">
  import { dialog } from "@tauri-apps/api";
  import { showEditMusicFolders } from "../../../stores/Overlays";
  import { musicDirectories } from "../../../stores/State";
  import OverlayBody from "../OverlayBody.svelte";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import FolderEntry from "./FolderEntry.svelte";
  import { Button } from "m3-svelte";

  let musicDirectoriesUnsub: Unsubscriber;

  let folders = [ ...$musicDirectories ];

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
    $showEditMusicFolders = false;
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

<OverlayBody show={$showEditMusicFolders} headline={"Music Folders"}>
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
      <Button type="text" on:click={pickFolders}>Add</Button>
      <Button type="text" on:click={done}>Done</Button>
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