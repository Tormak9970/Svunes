<script lang="ts">
  import Button from "@interactables/Button.svelte";
  import { ApiController } from "@lib/controllers/ApiController";
  import { albumInfos, availableReleaseGroups, onAlbumInfoDone, selectedReleaseGroupId, showPickAlbumInfo } from "@stores/Modals";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import Select from "../../interactables/select/Select.svelte";
  import LoadingSpinner from "../../layout/loading-animations/LoadingSpinner.svelte";
  import ModalBody from "../utils/ModalBody.svelte";

  let selectedReleaseGroupIdUnsub: Unsubscriber;
  let infoLoading = false;

  $: releaseGroupOptions = $availableReleaseGroups.map((releaseGroup) => {
    return { label: releaseGroup.title, value: releaseGroup.id };
  });

  $: releaseOptions = $albumInfos.map((info, i) => {
    return { label: info.title, value: i.toString() };
  });

  let infoIndex = "0";
  $: selectedInfo = $albumInfos[parseInt(infoIndex)];

  $: genreOptions = ["None", ...selectedInfo.genres].map((genre, i) => {
    return { label: genre, value: i.toString() };
  });

  let genreIndex = "0";
  $: selectedGenre = selectedInfo.genres[parseInt(genreIndex)];

  function cancel() {
    $showPickAlbumInfo = false;
    $albumInfos = [];
    $availableReleaseGroups = [];
    $selectedReleaseGroupId = "";
    $onAlbumInfoDone(null);
    $onAlbumInfoDone = () => {};
  }

  async function done() {
    $onAlbumInfoDone({
      title: selectedInfo.title,
      artist: selectedInfo.artist,
      genre: genreIndex === "0" ? undefined : selectedGenre,
      releaseYear: selectedInfo.releaseYear
    });
    $showPickAlbumInfo = false;
    $albumInfos = [];
    $availableReleaseGroups = [];
    $selectedReleaseGroupId = "";
    $onAlbumInfoDone = () => {};
  }

  onMount(() => {
    selectedReleaseGroupIdUnsub = selectedReleaseGroupId.subscribe((id) => {
      const currentReleaseGroup = $availableReleaseGroups.find((releaseGroup) => releaseGroup?.id === id);
      infoLoading = true;
      
      if (currentReleaseGroup) {
        ApiController.getReleasesForReleaseGroup(currentReleaseGroup).then((releasInfos) => {
          $albumInfos = releasInfos;
          infoLoading = false;
        });
      }
    });
  });

  onDestroy(() => {
    if (selectedReleaseGroupIdUnsub) selectedReleaseGroupIdUnsub();
  });
</script>

<div class="image-modal">
  <ModalBody open headline="Album Info Results" on:close={cancel}>
    <div class="select-wrapper">
      <Select name="Album" bind:value={$selectedReleaseGroupId} options={releaseGroupOptions} disabled={releaseGroupOptions.length === 1} />
    </div>
    <div class="select-wrapper">
      <Select name="Release" bind:value={infoIndex} options={releaseOptions} disabled={releaseOptions.length === 1} />
    </div>
    <div class="content-wrapper">
      {#if infoLoading}
        <div class="loading-content">
          <LoadingSpinner />
        </div>
      {:else}
        <div class="content">
          <div class="field">
            <b>Title:</b> {selectedInfo.title}
          </div>
          <div class="field">
            <b>Artist:</b> {selectedInfo.artist ?? "Unkown"}
          </div>
          <div style:margin="0.5rem 0">
            <Select name="Genre" bind:value={genreIndex} options={genreOptions} disabled={genreOptions.length === 1} />
          </div>
          <div class="field">
            <b>Release Year:</b> {selectedInfo.releaseYear ?? "Unkown"}
          </div>
        </div>
      {/if}
    </div>
    <div class="actions" slot="buttons">
      <div class="left" />
      <div class="right">
        <Button type="text" on:click={cancel}>Cancel</Button>
        <Button type="text" on:click={done}>Apply</Button>
      </div>
    </div>
  </ModalBody>
</div>

<style>
  .image-modal :global(dialog) {
    width: 21rem;
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
    margin-bottom: 0.5rem;
  }

  .content-wrapper {
    padding: 0px 0.5rem;
    height: 156px;
    
    position: relative;
    z-index: 1;

    margin-top: 1rem;
    margin-bottom: 1.5rem;
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

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field {
    width: 100%;

    font-size: 18px;
  }


  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>