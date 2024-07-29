<script lang="ts">
  import { ModalBody } from "@component-utils";
  import { ApiController } from "@controllers";
  import { Button, Select } from "@interactables";
  import LoadingSpinner from "@layout/loading-animations/LoadingSpinner.svelte";
  import { t } from "@stores/Locale";
  import { albumInfos, availableReleaseGroups, onAlbumInfoDone, selectedReleaseGroupId, showPickAlbumInfo } from "@stores/Modals";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  
  let open = true;

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
    $onAlbumInfoDone(null);
    open = false;
  }

  async function done() {
    $onAlbumInfoDone({
      title: selectedInfo.title,
      artist: selectedInfo.artist,
      genre: genreIndex === "0" ? undefined : selectedGenre,
      releaseYear: selectedInfo.releaseYear
    });
    open = false;
  }

  function close() {
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

<div class="info-modal">
  <ModalBody open={open} headline={$t("ALBUM_INFO_RESULTS_TITLE")} on:close={cancel} on:closeEnd={close}>
    <div class="select-wrapper">
      <Select name={$t("ALBUM_LABEL")} bind:value={$selectedReleaseGroupId} options={releaseGroupOptions} disabled={releaseGroupOptions.length === 1} />
    </div>
    <div class="select-wrapper">
      <Select name={$t("RELEASE_LABEL")} bind:value={infoIndex} options={releaseOptions} disabled={releaseOptions.length === 1} />
    </div>
    <div class="content-wrapper">
      {#if infoLoading}
        <div class="loading-content">
          <LoadingSpinner />
        </div>
      {:else}
        <div class="content font-label">
          <div class="field">
            <b>{$t("TITLE_LABEL")}:</b> {selectedInfo.title}
          </div>
          <div class="field">
            <b>{$t("ARTIST_LABEL")}:</b> {selectedInfo.artist ?? $t("UNKOWN_VALUE")}
          </div>
          <div style:margin="0.5rem 0">
            <Select name={$t("GENRE_LABEL")} bind:value={genreIndex} options={genreOptions} disabled={genreOptions.length === 1} />
          </div>
          <div class="field">
            <b>{$t("YEAR_LABEL")}:</b> {selectedInfo.releaseYear ?? $t("UNKOWN_VALUE")}
          </div>
        </div>
      {/if}
    </div>
    <div class="actions" slot="buttons">
      <div class="left" />
      <div class="right">
        <Button type="text" on:click={cancel}>{$t("CANCEL_ACTION")}</Button>
        <Button type="text" on:click={done}>{$t("APPLY_ACTION")}</Button>
      </div>
    </div>
  </ModalBody>
</div>

<style>
  .info-modal :global(dialog) {
    width: 21rem;
  }
  .info-modal :global(dialog > .m3-container) {
    padding: 1.5rem 0px;
    overflow: hidden;
    position: relative;
  }
  .info-modal :global(.m3-container > .content) {
    margin-bottom: 0.5rem;
  }
  .info-modal :global(.buttons) {
    padding: 0px 1rem;
  }
  .info-modal :global(.headline) {
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
  }


  .actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>