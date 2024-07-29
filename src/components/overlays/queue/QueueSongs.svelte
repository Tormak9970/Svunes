<script lang="ts">
  import { queue, songsMap } from "@stores/State";
  import QueueSong from "./QueueSong.svelte";
  
  import { Icon } from "@component-utils";
  import DragHandle from "@ktibow/iconset-material-symbols/drag-handle-rounded";
  import { inSelectMode } from "@stores/Select";
  import { clamp, swap } from "@utils";
  import { onDestroy, onMount } from "svelte";
  import { drag } from "svelte-gesture";
  import type { Unsubscriber } from "svelte/store";

  let queueUnsub: Unsubscriber;

  const entryHeight = 60;

  let songs = $queue.map((id) => $songsMap[id]);
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
        $queue = songs.map((song) => song.id);
        dragHeight = 0;
      }
    }
  }

  onMount(() => {
    queueUnsub = queue.subscribe((songIds) => {
      songs = songIds.map((id) => $songsMap[id]);
      newOrder = songs.map((_, i) => i);
    });
  });

  onDestroy(() => {
    if (queueUnsub) queueUnsub();
  });
</script>

<div class="songs-wrapper">
  <div class="song-entries" style:height="{songs.length * entryHeight}px">
    {#each songs as song, i (song.id + i)}
      <div
        class="entry"
        class:being-dragged={draggingIndex === i}
        style:top="{draggingIndex === i ? i * entryHeight + dragHeight : newOrder.indexOf(i) * entryHeight}px"
      >
        <QueueSong song={song} index={i} isDragging={draggingIndex === i}>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="handle" use:drag on:drag={getDragHandler(i)} style:visibility={$inSelectMode ? "hidden" : "visible"}>
            <Icon icon={DragHandle} height="30px" width="24px" />
          </div>
        </QueueSong>
      </div>
    {/each}
  </div>
</div>

<style>
  .songs-wrapper {
    width: 100%;
    height: fit-content;
    padding-bottom: 70px;
  }
  
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