<script lang="ts">
  import { showEditViewOrder } from "@stores/Modals";
  import { showErrorSnackbar, viewIndices, viewsToRender } from "@stores/State";
  import { View, Views, getViewName } from "@types";

  import { Icon, ModalBody } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import Checkbox from "@interactables/Checkbox.svelte";
  
  import DragIndicator from "@ktibow/iconset-material-symbols/drag-indicator";
  import { t } from "@stores/Locale";
  import { clamp, swap } from "@utils";
  import { drag } from "svelte-gesture";

  let open = true;

  const entryHeight = 40;

  let viewsList = Views.sort((a, b) => $viewIndices[a] - $viewIndices[b]);
  let newOrder = viewsList.map((_, i) => i);
  let checkDict = Object.fromEntries(viewsList.map((view) => [view, $viewsToRender.includes(view)])) as Record<View, boolean>;

  let reset = false;

  let draggingIndex = -1;
  let dragHeight = 0;

  function getDragHandler(originalIndex: number) {
    return ({ detail }: any) => {
      const { active, movement: [_, y] } = detail;

      draggingIndex = originalIndex;
      const curIndex = newOrder.indexOf(originalIndex);
      const curRow = clamp(Math.round((originalIndex * entryHeight + y) / entryHeight), 0, viewsList.length - 1);
      newOrder = swap(newOrder, curIndex, curRow);
      
      dragHeight = y;

      if (!active) {
        draggingIndex = -1;
        viewsList = newOrder.map((index) => viewsList[index]);
        newOrder = viewsList.map((_, i) => i);
        dragHeight = 0;
      }
    }
  }

  /**
   * Handles checking if a checkbox can be checked/unchecked.
   * @param view The view to set the checked status of.
   */
  function checkboxHandler(view: View) {
    return (e: Event) => {
      const checked = (e.currentTarget as HTMLInputElement).checked;
      const numChecked = viewsList.filter((view) => checkDict[view]).length;
      
      if (numChecked === 3 && !checked) {
        $showErrorSnackbar({ message: $t("MIN_PAGE_COUNT_MESSAGE") });
        reset = !reset;
      } else if (numChecked === 5 && checked && IS_MOBILE) {
        $showErrorSnackbar({ message: $t("MAX_PAGE_COUNT_MESSAGE") });
        reset = !reset;
      } else {
        checkDict[view] = checked;
      }
      
      checkDict = { ...checkDict };
    }
  }

  /**
   * Saves the user's changes
   */
  function done() {
    $viewsToRender = viewsList.filter((view) => checkDict[view]);
    $viewIndices = Object.fromEntries(viewsList.map((item, i) => [item, i])) as Record<View, number>;
    open = false;
  }
</script>

<ModalBody open={open} headline={$t("LIBRARY_ORDER_TITLE")} on:close={() => open = false} on:closeEnd={() => $showEditViewOrder = false}>
  <div>
    {#key reset}
      <div class="drag-container" style:height="{viewsList.length * entryHeight}px">
        {#each viewsList as view, i (view)}
          <!-- svelte-ignore missing-declaration -->
          {#if IS_MOBILE || view !== View.SETTINGS}
            <div
              class="entry"
              class:being-dragged={draggingIndex === i}
              style:top="{draggingIndex === i ? i * entryHeight + dragHeight : newOrder.indexOf(i) * entryHeight}px"
            >
              <div class="left">
                <div class="checkbox-container">
                  <Checkbox checked={checkDict[view]} on:input={checkboxHandler(view)} />
                </div>
                <div class="font-label">{getViewName(view)}</div>
              </div>
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div class="handle" use:drag on:drag={getDragHandler(i)}>
                <Icon icon={DragIndicator} height="30px" width="24px" />
              </div>
            </div>
          {/if}
        {/each}
      </div>
    {/key}
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
      <Button type="text" on:click={() => open = false }>{$t("CANCEL_ACTION")}</Button>
      <Button type="text" on:click={done}>{$t("DONE_ACTION")}</Button>
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

  .drag-container {
    margin-left: -1rem;
		width: calc(100% + 2rem);

    position: relative;
  }

  .entry {
    position: absolute;
    width: 100%;
    height: 40px;

    padding-left: 1rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    user-select: none;

    background-color: rgb(var(--m3-scheme-surface-container-high));

    transition: background-color 0.2 ease-out;
    border-radius: 4px;
    
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

    background-color: rgb(var(--m3-scheme-surface-container-highest));

    transition: scale 0.3s ease-out;
    scale: 1.05
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

  .handle { padding-right: 0.75rem; touch-action: none; cursor: grab; }
  .handle:active { cursor: grabbing; }
</style>