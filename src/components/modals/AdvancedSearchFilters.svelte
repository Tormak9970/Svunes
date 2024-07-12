<script lang="ts">
  import { showAdvancedFilters } from "@stores/Modals";

  import Button from "@interactables/Button.svelte";
  import Checkbox from "@interactables/Checkbox.svelte";
  import { showOnlyMissingAlbum, showOnlyMissingAlbumArtist, showOnlyMissingArtist, showOnlyMissingCover, showOnlyMissingGenre, showOnlyMissingTitle, showOnlyMissingYear } from "@stores/Search";
  import ModalBody from "./utils/ModalBody.svelte";

  let open = true;

  const options = [
    { label: "Only show with no title", enabled: $showOnlyMissingTitle },
    { label: "Only show with no cover", enabled: $showOnlyMissingCover },
    { label: "Only show with no album", enabled: $showOnlyMissingAlbum },
    { label: "Only show songs no artist", enabled: $showOnlyMissingArtist },
    { label: "Only show songs no album artist", enabled: $showOnlyMissingAlbumArtist },
    { label: "Only show songs no genre", enabled: $showOnlyMissingGenre },
    { label: "Only show songs no year", enabled: $showOnlyMissingYear },
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

<ModalBody headline="Advanced Song Filters" open={open} on:close={() => open = false} on:closeEnd={() => $showAdvancedFilters = false }>
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