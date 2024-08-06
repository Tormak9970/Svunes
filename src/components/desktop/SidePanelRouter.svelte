<script lang="ts">
  import { desktopSidePanel, sidePanelProps, SidePanels } from "@stores/Layout";
  import { bulkEditSongIds } from "@stores/Select";
  import { onDestroy, onMount, type ComponentType } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import AlbumEdit from "../../routes/albums/Edit.svelte";
  import PlaylistEdit from "../../routes/playlists/Edit.svelte";
  import SongBulkEdit from "../../routes/songs/BulkEdit.svelte";
  import SongDetails from "../../routes/songs/Details.svelte";
  import SongEdit from "../../routes/songs/Edit.svelte";

  let sidePanelUnsub: Unsubscriber;

  const routeMap: Record<SidePanels, ComponentType | undefined> = {
    0: undefined,
    1: SongDetails,
    2: SongEdit,
    3: SongBulkEdit,
    4: AlbumEdit,
    5: PlaylistEdit
  };

  onMount(() => {
    sidePanelUnsub = desktopSidePanel.subscribe((panel) => {
      if (panel !== SidePanels.SONG_BULK_EDIT) $bulkEditSongIds = [];
    });
  });

  onDestroy(() => {
    if (sidePanelUnsub) sidePanelUnsub();
  });
</script>

<div class="side-panel">
  <svelte:component this={routeMap[$desktopSidePanel]} params={$sidePanelProps} />
</div>

<style>
  .side-panel {
    margin-left: 0.5rem;
    height: 100%;
    width: 20rem;
    border-radius: 10px;
    overflow: hidden;

    position: relative;

    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
</style>