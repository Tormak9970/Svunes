<script lang="ts">
  import { playlists, playlistsMap, songsMap } from "@stores/State";
  import PlaylistSong from "./PlaylistSong.svelte";
  
  import { Icon } from "@component-utils";
  import { DragHandle } from "@icons";
  import { inSelectMode } from "@stores/Select";
  import { onDestroy, onMount } from "svelte";
  import { dragHandle, dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import { get, type Unsubscriber } from "svelte/store";
  import { isLandscape } from "../../stores/Layout";

  let playlistsMapUnsub: Unsubscriber;

  export let playlistId: string;

  const flipDurationMs = 100;

  // ! using $playlistsMap instead of "get(playlistsMap)" will cause svelte to throw an error.
  let playlist = get(playlistsMap)[playlistId];
  let songs = playlist.songIds.map((id) => $songsMap[id]);
  let items: any[] = songs.map((song) => {
    return {
      id: song.id,
      data: song
    }
  });
  
  function consider(e: CustomEvent<DndEvent>) {
    items = e.detail.items;
  }
  
  function finalize(e: CustomEvent<DndEvent>) {
    items = e.detail.items;
    songs = items.map((item) => item.data);
    playlist.songIds = items.map((item) => item.id);
    $playlists = [ ...$playlists ];
  }

  onMount(() => {
    playlistsMapUnsub = playlistsMap.subscribe((map) => {
      songs = map[playlistId].songIds.map((id) => $songsMap[id]);
      items = songs.map((song) => {
        return {
          id: song.id,
          data: song
        }
      });
    });
  });

  onDestroy(() => {
    if (playlistsMapUnsub) playlistsMapUnsub();
  });
</script>

<div class="song-entries" use:dragHandleZone={{ items, flipDurationMs, axis: "y", dropTargetStyle: { backgroundColor: $isLandscape ? "rgb(var(--m3-scheme-surface-container-high))" : "transparent" } }} on:consider={consider} on:finalize={finalize}>
  {#each items as item (item.id)}
    <div class="entry" animate:flip="{{ duration: flipDurationMs }}">
      <PlaylistSong song={item.data}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="handle" use:dragHandle style:visibility={($inSelectMode || item[SHADOW_ITEM_MARKER_PROPERTY_NAME]) ? "hidden" : "visible"}>
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

    background-color: transparent;
    border-radius: 10px;

    transition: background-color 0.3s ease-in-out;
  }

  .handle {
    height: 100%;
    width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    position: absolute;

    cursor: grab;
    touch-action: none;
  }

  .handle:active { cursor: grabbing; }

  .entry {
    border-radius: 10px;
    width: 100%;
    margin-bottom: 2px;
  }
  
  :global(#dnd-action-dragged-el) {
    outline: none;
    box-shadow:
      0px 2px 4px -1px rgb(var(--m3-scheme-shadow) / 0.2),
      0px 4px 5px 0px rgb(var(--m3-scheme-shadow) / 0.14),
      0px 1px 10px 0px rgb(var(--m3-scheme-shadow) / 0.12);
	}
</style>