<script lang="ts">
  import { ModalBody } from "@component-utils";
  import { ApiController } from "@controllers";
  import { scrollShadow } from "@directives";
  import Button from "@interactables/Button.svelte";
  import Select from "@interactables/select/Select.svelte";
  import CardClickable from "@layout/CardClickable.svelte";
  import Lazy from "@layout/Lazy.svelte";
  import LoadingSpinner from "@layout/loading-animations/LoadingSpinner.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import { t } from "@stores/Locale";
  import { albumCovers, availableReleaseGroups, onPickCoverDone, selectedReleaseGroupId, showPickAlbumCover } from "@stores/Modals";
  import { IMAGE_FADE_OPTIONS } from "@utils";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";

  let open = true;

  let selectedReleaseGroupIdUnsub: Unsubscriber;

  const imageSize = 150;
  const iconSize = 40;

  $: releaseGroupOptions = $availableReleaseGroups.map((releaseGroup) => {
    return { label: releaseGroup.title, value: releaseGroup.id };
  });

  let selectedIndex = -1;

  let showDownloadingSpinner = false;
  let coversLoading = false;

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
    $onPickCoverDone(null);
    open = false;
  }

  async function done() {
    showDownloadingSpinner = true;
    await ApiController.getLocalImagePath($albumCovers[selectedIndex]).then((localPath) => {
      $onPickCoverDone(localPath);
      open = false;
    });
  }

  function close() {
    $showPickAlbumCover = false;
    $albumCovers = [];
    $availableReleaseGroups = [];
    $selectedReleaseGroupId = "";
    $onPickCoverDone = () => {};
  }

  onMount(() => {
    selectedReleaseGroupIdUnsub = selectedReleaseGroupId.subscribe((id) => {
      const currentReleaseGroup = $availableReleaseGroups.find((releaseGroup) => releaseGroup?.id === id);
      coversLoading = true;
      
      if (currentReleaseGroup) {
        ApiController.getCoversForReleaseGroup(currentReleaseGroup).then((covers) => {
          $albumCovers = covers;
          coversLoading = false;
        });
      }
    });
  });

  onDestroy(() => {
    if (selectedReleaseGroupIdUnsub) selectedReleaseGroupIdUnsub();
  });
</script>

<div class="image-modal">
  <ModalBody open={open} headline={$t("ALBUM_COVER_RESULTS_TITLE")} loading={showDownloadingSpinner} on:close={cancel} on:closeEnd={close}>
    <div class="select-wrapper">
      <Select name={$t("ALBUM_LABEL")} bind:value={$selectedReleaseGroupId} options={releaseGroupOptions} disabled={releaseGroupOptions.length === 1} />
    </div>
    <div class="content-wrapper">
      {#if coversLoading}
        <div class="loading-content">
          <LoadingSpinner />
        </div>
      {:else}
        <div class="content styled-scrollbar" use:scrollShadow >
          {#each [...$albumCovers, ...$albumCovers] as url, i (`${$selectedReleaseGroupId}|${url}|${i}`)}
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
      {/if}
    </div>
    <div class="actions" slot="buttons">
      <div class="left" />
      <div class="right">
        <Button type="text" on:click={cancel}>{$t("CANCEL_ACTION")}</Button>
        <Button type="text" disabled={selectedIndex === -1} on:click={done}>{$t("APPLY_ACTION")}</Button>
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

  .select-wrapper {
    padding: 0px 0.5rem;
  }

  .content-wrapper {
    padding: 0px 0.5rem;
    height: 400px;
    
    position: relative;
    z-index: 1;
  }

  .loading-content {
    height: 100%;
    width: 325px;
    
    margin-top: 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-columns: 160px 160px;
    gap: 5px;

    overflow-y: scroll;
    overflow-x: hidden;

    margin-top: 0.5rem;
  }


  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>