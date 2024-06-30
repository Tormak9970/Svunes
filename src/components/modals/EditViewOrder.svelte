<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { dragHandle, dragHandleZone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import type { Unsubscriber } from "svelte/store";
  
  import { showEditViewOrder } from "@stores/Modals";
  import { showErrorSnackbar, viewIndices, viewsToRender } from "@stores/State";
  import { View, Views, getViewName } from "../../types/View";

  import Button from "@interactables/Button.svelte";
  import Checkbox from "@interactables/Checkbox.svelte";
  import Icon from "../utils/Icon.svelte";
  import ModalBody from "./utils/ModalBody.svelte";
  
  import DragIndicator from "@ktibow/iconset-material-symbols/drag-indicator";

  type ListEntry = {
    id: number,
    name: string,
    view: View,
    checked: boolean
  }

  let viewsToRenderUnsub: Unsubscriber;

  let items: ListEntry[] = [];

  let reset = false;

  const flipDurationMs = 200;

  /**
   * Handles checking if a checkbox can be checked/unchecked.
   * @param view The view to set the checked status of.
   */
  function checkboxHandler(view: View) {
    return (e: Event) => {
      const checked = (e.currentTarget as HTMLInputElement).checked;
      const numChecked = items.filter((item) => item.checked).length;
      const item = items.find((item) => item.view === view)!;
      
      if (numChecked === 3 && !checked) {
        $showErrorSnackbar({ message: "Min page count is 3" });
        reset = !reset;
      } else if (numChecked === 5 && checked) {
        $showErrorSnackbar({ message: "Max page count is 5" });
        reset = !reset;
      } else {
        item.checked = checked;
      }
      
      items = structuredClone(items);
    }
  }
	
  /**
   * Handles sorting on drag and drop events.
   */
	function handleSort(e: any) {
		items = e.detail.items;
	}

  /**
   * Saves the user's changes
   */
  function done() {
    $viewIndices = Object.fromEntries(items.map((item, i) => [item.view, i])) as Record<View, number>;
    $viewsToRender = items.filter((item) => item.checked).map((item) => item.view);
    $showEditViewOrder = false;
  }

  function styleDraggedElement(elem: HTMLElement | undefined) {
    elem!.style.backgroundColor = "rgb(var(--m3-scheme-surface-container-highest))";
  }

  onMount(() => {
    viewsToRenderUnsub = viewsToRender.subscribe((newViews) => {
      items = Views.sort((a, b) => $viewIndices[a] - $viewIndices[b]).map((view) => {
        return {
          id: view,
          name: getViewName(view),
          view: view,
          checked: newViews.includes(view)
        }
      });
    });
  });

  onDestroy(() => {
    if (viewsToRenderUnsub) viewsToRenderUnsub();
  });
</script>

<ModalBody show={$showEditViewOrder} headline="Library Order" onClose={() => $showEditViewOrder = false }>
  <div slot="content">
    {#key reset}
      <div class="drag-container"
        use:dragHandleZone="{{ items, flipDurationMs, dropTargetStyle: {}, morphDisabled: true, transformDraggedElement: styleDraggedElement }}"
        on:consider="{handleSort}"
        on:finalize="{handleSort}"
      >
        {#each items as item (item.id)}
          <div class="entry" animate:flip="{{ duration: flipDurationMs }}">
            <div class="left">
              <div class="checkbox-container">
                <Checkbox checked={item.checked} on:input={checkboxHandler(item.view)} />
              </div>
              <div>{item.name}</div>
            </div>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="handle" use:dragHandle>
              <Icon icon={DragIndicator} height="30px" width="24px" />
            </div>
          </div>
        {/each}
      </div>
    {/key}
  </div>
  <div class="actions" slot="actions">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={() => $showEditViewOrder = false }>Cancel</Button>
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

  .entry {
    margin-left: -10px;
    padding-left: 10px;
		width: calc(100% + 10px);
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    user-select: none;

    background-color: rgb(var(--m3-scheme-surface-container-high));

    transition: background-color 0.2 ease-out;
    border-radius: 4px;
	}

  .left {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .checkbox-container,
  .handle {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>