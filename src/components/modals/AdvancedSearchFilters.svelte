<script lang="ts">
  import { showAdvancedFilters } from "@stores/Modals";

  import Button from "@interactables/Button.svelte";
  import Checkbox from "@interactables/Checkbox.svelte";
  import { t } from "@stores/Locale";
  import { showOnlyMissingAlbum, showOnlyMissingAlbumArtist, showOnlyMissingArtist, showOnlyMissingCover, showOnlyMissingGenre, showOnlyMissingTitle, showOnlyMissingYear } from "@stores/Search";
  import ModalBody from "./utils/ModalBody.svelte";

  let open = true;

  const options = [
    { label: $t("FILTER_ONLY_TITLE"), enabled: $showOnlyMissingTitle },
    { label: $t("FILTER_ONLY_COVER"), enabled: $showOnlyMissingCover },
    { label: $t("FILTER_ONLY_ALBUM"), enabled: $showOnlyMissingAlbum },
    { label: $t("FILTER_ONLY_ARTIST"), enabled: $showOnlyMissingArtist },
    { label: $t("FILTER_ONLY_ALBUM_ARTIST"), enabled: $showOnlyMissingAlbumArtist },
    { label: $t("FILTER_ONLY_GENRE"), enabled: $showOnlyMissingGenre },
    { label: $t("FILTER_ONLY_YEAR"), enabled: $showOnlyMissingYear },
  ];

  function done() {
    $showOnlyMissingTitle = options[0].enabled;
    $showOnlyMissingCover = options[1].enabled;
    $showOnlyMissingAlbum = options[2].enabled;
    $showOnlyMissingArtist = options[3].enabled;
    $showOnlyMissingAlbumArtist = options[4].enabled;
    $showOnlyMissingGenre = options[5].enabled;
    $showOnlyMissingYear = options[6].enabled;
    
    open = false;
  }
</script>

<ModalBody headline={$t("ADVANCED_SONG_FILTERS_TITLE")} open={open} on:close={() => open = false} on:closeEnd={() => $showAdvancedFilters = false }>
  <div style="height: fit-content;">
    {#each options as option, i (option.label + "|" + i)}
      <div class="entry">
        <div class="checkbox-container">
          <Checkbox bind:checked={option.enabled} />
        </div>
        <div>{option.label}</div>
      </div>
    {/each}
  </div>
  <div class="actions" slot="buttons">
    <div class="left" />
    <div class="right">
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

  .entry {
    width: 100%;
    height: 40px;

    display: flex;
    align-items: center;
    gap: 15px;

    user-select: none;

    background-color: rgb(var(--m3-scheme-surface-container-high));

    border-radius: 4px;
	}

  .checkbox-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>