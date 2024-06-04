<script lang="ts">
  import { dragHandle, dragHandleZone } from "svelte-dnd-action";
  import PlaylistSong from "./PlaylistSong.svelte";
  import type { Playlist } from "../../lib/models/Playlist";
  import { playlists, songsMap } from "../../stores/State";
  import { flip } from "svelte/animate";
  import { afterUpdate } from "svelte";
  import type { Song } from "../../lib/models/Song";
  
  import DragHandle from "@ktibow/iconset-material-symbols/drag-handle";
  import Icon from "../../components/utils/Icon.svelte";

  export let playlist: Playlist;

  $: songs = playlist.songIds.map((id) => $songsMap[id]) ?? [];
  let oldLength = 0;
  let items: { id: string, song: Song }[] = [];

  const flipDurationMs = 100;
  let transition = true;
  
  function handleMouseDown() {
    transition = false;
  }

  function handleMouseUp() {
    transition = true;
  }

  /**
   * Handles sorting on drag and drop events.
   */
  function handleSort(e: any) {
    items = e.detail.items;
  }

  /**
   * Handles sorting on drag and drop events.
   */
  function finalize(e: any) {
    items = e.detail.items;
    const newIds = items.map((item) => item.song.id);
    
    if (JSON.stringify(newIds) !== JSON.stringify(playlist.songIds)) {
      playlist.songIds = newIds;
      $playlists = [ ...$playlists ];
    }
  }

  afterUpdate(() => {
    if (songs.length !== oldLength) {
      oldLength = songs.length;
      items = songs.map((song) => {
        return {
          id: song.id,
          song: song
        }
      });
    }
  });
</script>

<svelte:window on:mouseup={handleMouseUp} />

<div
  class="song-entries"
  use:dragHandleZone="{{ items, flipDurationMs, dropTargetStyle: {} }}"
  on:consider="{handleSort}"
  on:finalize="{finalize}"
>
  {#each items as item(item.id)}
    <div class="entry" animate:flip="{{ duration: flipDurationMs }}">
      <PlaylistSong song={item.song} transition={transition}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="handle" use:dragHandle on:mousedown={handleMouseDown}>
          <Icon icon={DragHandle} height="30px" width="24px" />
        </div>
      </PlaylistSong>
    </div>
  {/each}
</div>

<style>
  .song-entries {
    width: calc(100% - 10px);
    margin: 0px 5px;
  }

  .handle {
    height: 100%;
    width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>