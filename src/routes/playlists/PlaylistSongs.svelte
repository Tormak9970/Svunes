<script lang="ts">
  import { playlists, playlistsMap, songsMap } from "@stores/State";
  import PlaylistSong from "./PlaylistSong.svelte";
  
  import { Icon } from "@component-utils";
  import { DragHandle } from "@icons";
  import { inSelectMode } from "@stores/Select";
  import { clamp, swap } from "@utils";
  import { onDestroy, onMount } from "svelte";
  import { drag } from "svelte-gesture";
  import { get, type Unsubscriber } from "svelte/store";

  let playlistsMapUnsub: Unsubscriber;

  export let playlistId: string;

  const entryHeight = 60;

  // ! using $playlistsMap instead of "get(playlistsMap)" will cause svelte to throw an error.
  let playlist = get(playlistsMap)[playlistId];
  let songs = playlist.songIds.map((id) => $songsMap[id]);
  let newOrder = songs.map((_, i) => i);

  let draggingIndex = -1;
  let dragHeight = 0;

  function getDragHandler(originalIndex: number) {
    return ({ detail }: any) => {
      const { active, movement: [_, y] } = detail;

      draggingIndex = originalIndex;
      const curIndex = newOrder.indexOf(originalIndex);
      const curRow = clamp(Math.round((originalIndex * entryHeight + y) / entryHeight), 0, songs.length - 1);
      newOrder = swap(newOrder, curIndex, curRow);
      
      dragHeight = y;

      if (!active) {
        draggingIndex = -1;
        songs = newOrder.map((index) => songs[index]);
        newOrder = songs.map((_, i) => i);
        playlist.songIds = songs.map((song) => song.id);
        $playlists = [ ...$playlists ];
        dragHeight = 0;
      }
    }
  }

  onMount(() => {
    playlistsMapUnsub = playlistsMap.subscribe((map) => {
      songs = map[playlistId].songIds.map((id) => $songsMap[id]);
      newOrder = songs.map((_, i) => i);
    });
  });

  onDestroy(() => {
    if (playlistsMapUnsub) playlistsMapUnsub();
  })
</script>

<div class="song-entries" style:height="{songs.length * entryHeight}px">
  {#each songs as song, i (song.id)}
    <div
      class="entry"
      class:being-dragged={draggingIndex === i}
      style:top="{draggingIndex === i ? i * entryHeight + dragHeight : newOrder.indexOf(i) * entryHeight}px"
    >
      <PlaylistSong song={song} isDragging={draggingIndex === i}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="handle" use:drag on:drag={getDragHandler(i)} style:visibility={$inSelectMode ? "hidden" : "visible"}>
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

    position: relative;
  }

  .handle {
    height: 100%;
    width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    cursor: grab;
    touch-action: none;
  }
  .handle:active { cursor: grabbing; }

  .entry {
    position: absolute;
    border-radius: 10px;

    width: 100%;

    transition: top 0.3s ease-out, scale 0.3s ease-out;

    z-index: 1;
    scale: 1;
  }

  .being-dragged {
    z-index: 2;
    box-shadow:
      0px 2px 4px -1px rgb(var(--m3-scheme-shadow) / 0.2),
      0px 4px 5px 0px rgb(var(--m3-scheme-shadow) / 0.14),
      0px 1px 10px 0px rgb(var(--m3-scheme-shadow) / 0.12);
    scale: 1.05;
    
    transition: scale 0.3s ease-out;
  }
</style>