<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import ViewContainer from "@component-utils/ViewContainer.svelte";
  import Button from "@interactables/Button.svelte";
  import MenuButton from "@interactables/MenuButton.svelte";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Search from "@ktibow/iconset-material-symbols/search";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import MenuItem from "@layout/MenuItem.svelte";
  import ViewHeader from "@layout/ViewHeader.svelte";
  import VirtualGrid from "@layout/VirtualGrid.svelte";
  import VirtualList from "@layout/VirtualList.svelte";
  import { LogController } from "@lib/controllers/utils/LogController";
  import type { Artist } from "@models";
  import { t } from "@stores/Locale";
  import { showArtistSortOrder, showGridSize } from "@stores/Modals";
  import { selectedChips } from "@stores/Search";
  import { artistGridSize, artists, artistsIsScrolled, artistSortOrder, lastView, selectedView } from "@stores/State";
  import { GRID_IMAGE_DIMENSIONS, stringSort } from "@utils";
  import ArtistGridEntry from "@views/artists/ArtistGridEntry.svelte";
  import ArtistListEntry from "@views/artists/ArtistListEntry.svelte";
  import { afterUpdate } from "svelte";
  import { push } from "svelte-spa-router";
  import { GridSize, type ArtistSortOrder } from "../../types/Settings";
  import { View } from "../../types/View";

  const keyFunction = (entry: { data: Artist}) => `${entry.data.imagePath}${entry.data.name}${entry.data.albumNames.size}${entry.data.songIds.length}`;

  let gridSize = $artistGridSize;
  let menuIsOpen = false;

  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $lastView = $selectedView;
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $lastView = $selectedView;
    $selectedView = View.SEARCH;
    $selectedChips = [ "artist" ];
    push("/search");
  }

  /**
   * Sorts the artists.
   * @param artistsList The list of artists.
   * @param albumOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortArtists(artistsList: Artist[], sortOrder: ArtistSortOrder): Artist[] {
    let sorted: Artist[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = artistsList.sort(stringSort<Artist>("name"));
    } else if (sortOrder === "Album Count") {
      sorted = artistsList.sort((a: Artist, b: Artist) => b.albumNames.size - a.albumNames.size);
    } else if (sortOrder === "Track Count") {
      sorted = artistsList.sort((a: Artist, b: Artist) => b.songIds.length - a.songIds.length);
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedArtists = sortArtists($artists, $artistSortOrder);

  afterUpdate(() => {
    if ($artistGridSize !== gridSize) {
      gridSize = $artistGridSize;
      $artistsIsScrolled = false;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <ViewHeader title={$t("ARTISTS_TITLE")} highlight={!$artistsIsScrolled}>
      <div slot="left">
        <Button type="text" iconType="full" on:click={openSearch}>
          <Icon icon={Search} width="20px" height="20px" />
        </Button>
      </div>
      <div slot="right">
        <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
          <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>{$t("GRID_SIZE_ACTION")}</MenuItem>
          <MenuItem on:click={() => { $showArtistSortOrder = true; menuIsOpen = false; }}>{$t("SORT_BY_ACTION")}</MenuItem>
          <MenuItem on:click={goToSettings}>{$t("SETTINGS_ACTION")}</MenuItem>
        </MenuButton>
      </div>
    </ViewHeader>
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedArtists.length > 0}
      {#if $artistGridSize === GridSize.LIST}
        <VirtualList
          name="artistsView"
          itemHeight={60}
          items={sortedArtists}
          keyFunction={keyFunction}
          bind:isScrolled={$artistsIsScrolled}
          let:entry
        >
          <ArtistListEntry artist={entry} />
        </VirtualList>
      {:else}
        <VirtualGrid
          name="artistsView"
          itemHeight={GRID_IMAGE_DIMENSIONS[$artistGridSize].height + GRID_IMAGE_DIMENSIONS[$artistGridSize].infoHeight + 12}
          itemWidth={GRID_IMAGE_DIMENSIONS[$artistGridSize].width + 10}
          rowGap={GRID_IMAGE_DIMENSIONS[$artistGridSize].gap}
          columnGap={GRID_IMAGE_DIMENSIONS[$artistGridSize].gap}
          items={sortedArtists}
          keyFunction={keyFunction}
          bind:isScrolled={$artistsIsScrolled}
          let:entry
        >
          <ArtistGridEntry artist={entry} />
        </VirtualGrid>
      {/if}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="font-label message">{$t("NO_TYPE_FOUND_MESSAGE").replace("{type}", $t("ARTIST_PLURAL_VALUE"))}.</div>
      </div>
    {/if}
  </div>
</ViewContainer>

<style>
  .message-container {
    margin-top: 40%;
    color: rgb(var(--m3-scheme-on-secondary));
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message {
    max-width: 300px;
    text-align: center;
  }
</style>