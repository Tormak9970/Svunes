<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { flip } from "svelte/animate";
  import type { Unsubscriber } from "svelte/store";
	import {dragHandleZone, dragHandle} from "svelte-dnd-action";
  
  import { viewsToRender } from "../../stores/State";
  import { showEditViewOrder } from "../../stores/Modals";
  import { View, Views, getViewName } from "../../types/View";

  import ModalBody from "./utils/ModalBody.svelte";
  import Button from "../interactables/Button.svelte";
  import Checkbox from "../interactables/Checkbox.svelte";
  import Icon from "../utils/Icon.svelte";
  import ErrorSnackbar from "../snackbars/ErrorSnackbar.svelte";
  
  import DragIndicator from "@ktibow/iconset-material-symbols/drag-indicator";
  
  let snackbar: (data: ShowSnackbarOptions) => void;

  type ListEntry = {
    id: number,
    name: string,
    view: View,
    checked: boolean
  }

  let viewsToRenderUnsub: Unsubscriber;

  let items: ListEntry[] = [];

  let reset = false;

  const flipDurationMs = 100;

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
        snackbar({ message: "Min page count is 3", closable: false, timeout: 3000 });
        reset = !reset;
      } else if (numChecked === 5 && checked) {
        snackbar({ message: "Max page count is 5", closable: false, timeout: 3000 });
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
    $viewsToRender = items.filter((item) => item.checked).map((item) => item.view);
    $showEditViewOrder = false;
  }

  onMount(() => {
    viewsToRenderUnsub = viewsToRender.subscribe((newViews) => {
      items = Views.map((view) => {
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

<ModalBody show={$showEditViewOrder} headline={"Library Order"} onClose={() => $showEditViewOrder = false }>
  <div slot="content">
    {#key reset}
      <div class="drag-container"
        use:dragHandleZone="{{ items, flipDurationMs, dropTargetStyle: {} }}"
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
            <div class="handle" use:dragHandle>
              <Icon icon={DragIndicator} height="30px" width="24px" />
            </div>
          </div>
        {/each}
      </div>
    {/key}
    <ErrorSnackbar bind:show={snackbar} />
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
		width: 100%;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: space-between;
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