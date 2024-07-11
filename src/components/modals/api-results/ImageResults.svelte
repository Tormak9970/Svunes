<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import CardClickable from "@layout/CardClickable.svelte";
  import Lazy from "@layout/Lazy.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import { ApiController } from "@lib/controllers/ApiController";
  import { IMAGE_FADE_OPTIONS } from "@lib/utils/ImageConstants";
  import { availableReleaseGroups, imageResults, onImageResultsDone, selectedReleaseGroupId, showImageResults } from "@stores/Modals";
  import Select from "../../interactables/Select.svelte";
  import SelectOption from "../../interactables/SelectOption.svelte";
  import ModalBody from "../utils/ModalBody.svelte";

  const imageSize = 150;
  const iconSize = 40;
  
  $: console.log($availableReleaseGroups);
  $: console.log($selectedReleaseGroupId);

  let selectedIndex = -1;
  let isOverflowingTop = false;
  let isOverflowingBottom = $imageResults.length > 4;

  let showDownloadingSpinner = false;
  
  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    isOverflowingTop = element.scrollTop !== 0;
    isOverflowingBottom = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) > 1;
  }

  /**
   * Toggles whether an image is selected.
   * @param index The index of the image to toggle.
   */
  function handleImageClick(index: number) {
    if (selectedIndex === index) {
      selectedIndex = -1;
    } else {
      selectedIndex = index;
    }
  }

  function cancel() {
    $showImageResults = false;
    $imageResults = [];
    $availableReleaseGroups = [];
    $selectedReleaseGroupId = "";
    $onImageResultsDone(null);
    $onImageResultsDone = () => {};
  }

  async function done() {
    showDownloadingSpinner = true;
    await ApiController.getLocalImagePath($imageResults[selectedIndex]).then((localPath) => {
      $onImageResultsDone(localPath);
      $showImageResults = false;
      $imageResults = [];
      $availableReleaseGroups = [];
      $selectedReleaseGroupId = "";
      $onImageResultsDone = () => {};
    });
  }
</script>

<div class="image-modal">
  <ModalBody open headline="Album Cover Results" loading={showDownloadingSpinner} on:close={cancel}>
    <div class="content-wrapper">
      <Select label="Album" value={$selectedReleaseGroupId}>
        {#each $availableReleaseGroups as releaseGroup}
          <SelectOption value={releaseGroup.id}>{releaseGroup.title}</SelectOption>
        {/each}
      </Select>
      <div
        class="content"
        class:overflow-top={isOverflowingTop}
        class:overflow-bottom={isOverflowingBottom}
        on:scroll={scrollHandler}
      >
        {#each $imageResults as url, i}
          <CardClickable type="transparent" highlight={selectedIndex === i} on:click={() => handleImageClick(i)} extraOptions={{ style: `width: ${imageSize + 10}px; height: ${imageSize + 10}px; display: flex; align-items: center; padding: 5px; border-radius: 10px; position: relative; z-index: 1;` }}>
            <div style="width: {imageSize}px; height: {imageSize}px; overflow: hidden; border-radius: 10px;">
              {#if url !== ""}
                <Lazy height={imageSize} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img src="{url}" style="width: {imageSize}px; height: {imageSize}px;" draggable="false" on:error={onError} />
                  <span slot="placeholder">
                    <MusicNotePlaceholder width={iconSize} height={iconSize} />
                  </span>
                </Lazy>
              {:else}
                <MusicNotePlaceholder width={iconSize} height={iconSize} />
              {/if}
            </div>
          </CardClickable>
        {/each}
      </div>
    </div>
    <div class="actions" slot="buttons">
      <div class="left" />
      <div class="right">
        <Button type="text" on:click={cancel}>Cancel</Button>
        <Button type="text" disabled={selectedIndex === -1} on:click={done}>Apply</Button>
      </div>
    </div>
  </ModalBody>
</div>

<style>
  .image-modal :global(dialog) {
    min-width: 20rem;
  }
  .image-modal :global(dialog > .m3-container) {
    padding: 1.5rem 0px;
    overflow: hidden;
    position: relative;
  }
  .image-modal :global(.m3-container > .content) {
    margin-bottom: 0.5rem;
  }
  .image-modal :global(.buttons) {
    padding: 0px 1rem;
  }
  .image-modal :global(.headline) {
    padding: 0px 1rem;
  }

  .content-wrapper {
    padding: 0px 0.5rem;
    height: 400px;
    
    position: relative;
    z-index: 1;
  }

  .content {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-columns: 160px 160px;
    gap: 5px;

    overflow: scroll;
  }

  .overflow-top::before {
    background: linear-gradient(
      to bottom,
      rgb(var(--m3-scheme-surface-container-high) / 0.8),
      transparent
    );
    content: "";
    width: 100%;
    position: absolute;
    height: 40px;
    z-index: 3;
    top: 0;

    pointer-events: none;
  }

  .overflow-bottom::after {
    background: linear-gradient(
      to top,
      rgb(var(--m3-scheme-surface-container-high) / 0.8),
      transparent
    );
    content: "";
    width: 100%;
    position: absolute;
    height: 40px;
    z-index: 2;
    bottom: 0;

    pointer-events: none;
  }


  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>