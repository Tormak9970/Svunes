<script lang="ts">
  import { queue, songsMap } from "@stores/State";
  import QueueSong from "./QueueSong.svelte";
  
  import { Icon } from "@component-utils";
  import { DragHandle } from "@icons";
  import { inSelectMode } from "@stores/Select";
  import { onDestroy, onMount } from "svelte";
  import { flip } from "svelte/animate";
  import type { Unsubscriber } from "svelte/store";
// @ts-expect-error temporary fix until this gets merged
  import { dragHandle, dragHandleZone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "../../../../node_modules/svelte-dnd-action/src/index";


  let queueUnsub: Unsubscriber;

  const flipDurationMs = 100;

  let songs = $queue.map((id) => $songsMap[id]);
  let items: any[] = songs.map((song, i) => {
    return {
      id: song.id + "|" + i,
      data: song
    }
  });
  
  function consider(e: CustomEvent<DndEvent>) {
    items = e.detail.items;
  }
  
  function finalize(e: CustomEvent<DndEvent>) {
    items = e.detail.items;
    songs = items.map((item) => item.data);
    $queue = items.map((item) => item.data.id);
  }


  onMount(() => {
    queueUnsub = queue.subscribe((songIds) => {
      songs = songIds.map((id) => $songsMap[id]);
      items = songs.map((song, i) => {
        return {
          id: song.id + "|" + i,
          data: song
        }
      });
    });
  });

  onDestroy(() => {
    if (queueUnsub) queueUnsub();
  });
</script>

<div class="songs-wrapper">
  <div class="song-entries" use:dragHandleZone={{ items, flipDurationMs, axis: "y", dropTargetStyle: {} }} on:consider={consider} on:finalize={finalize}>
    {#each items as item, i (item.id)}
      <div class="entry" animate:flip="{{ duration: flipDurationMs }}">
        <QueueSong song={item.data} index={i}>
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="handle" use:dragHandle style:visibility={($inSelectMode || item[SHADOW_ITEM_MARKER_PROPERTY_NAME]) ? "hidden" : "visible"}>
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