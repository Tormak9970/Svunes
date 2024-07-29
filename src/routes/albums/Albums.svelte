<script lang="ts">
  import { Icon, ViewContainer } from "@component-utils";
  import { LogController } from "@controllers";
  import { Button, MenuButton } from "@interactables";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import Search from "@ktibow/iconset-material-symbols/search";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import { MenuItem, ViewHeader, VirtualGrid, VirtualList } from "@layout";
  import type { Album } from "@models";
  import { t } from "@stores/Locale";
  import { showAlbumSortOrder, showGridSize } from "@stores/Modals";
  import { selectedChips } from "@stores/Search";
  import { albumGridSize, albumSortOrder, albums, albumsIsScrolled, lastView, selectedView } from "@stores/State";
  import { GridSize, View, type AlbumSortOrder } from "@types";
  import { GRID_IMAGE_DIMENSIONS, dateSort, stringSort } from "@utils";
  import AlbumGridEntry from "@views/albums/AlbumGridEntry.svelte";
  import AlbumListEntry from "@views/albums/AlbumListEntry.svelte";
  import { afterUpdate } from "svelte";
  import { push } from "svelte-spa-router";

  const keyFunction = (entry: { data: Album}) => `${entry.data.artPath}${entry.data.name}${entry.data.releaseYear}${entry.data.songIds.length}${entry.data.lastPlayedOn}`;

  let gridSize = $albumGridSize;
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
    $selectedChips = [ "album" ];
    push("/search");
  }

  /**
   * Sorts the albums.
   * @param albumsList The list of albums.
   * @param albumOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortAlbums(albumsList: Album[], sortOrder: AlbumSortOrder): Album[] {
    let sorted: Album[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = albumsList.sort(stringSort<Album>("name"));
    } else if (sortOrder === "Artist") {
      sorted = albumsList.sort(stringSort<Album>("albumArtist"));
    } else if (sortOrder === "Year") {
      sorted = albumsList.sort((a: Album, b: Album) => b.releaseYear - a.releaseYear);
    } else if (sortOrder === "Length") {
      sorted = albumsList.sort((a: Album, b: Album) => b.albumLength - a.albumLength);
    } else if (sortOrder === "Track Count") {
      sorted = albumsList.sort((a: Album, b: Album) => b.songIds.length - a.songIds.length);
    } else if (sortOrder === "Most Played") {
      sorted = albumsList.sort((a: Album, b: Album) => b.numTimesPlayed - a.numTimesPlayed);
    } else if (sortOrder === "Last Played") {
      sorted = albumsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedAlbums = sortAlbums($albums, $albumSortOrder);

  afterUpdate(() => {
    if ($albumGridSize !== gridSize) {
      gridSize = $albumGridSize;
      $albumsIsScrolled = false;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <ViewHeader title={$t("ALBUMS_TITLE")} highlight={$albumsIsScrolled}>
      <div slot="left">
        <Button type="text" iconType="full" on:click={openSearch}>
          <Icon icon={Search} width="20px" height="20px" />
        </Button>
      </div>
      <div slot="right">
        <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
          <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>{$t("GRID_SIZE_ACTION")}</MenuItem>
          <MenuItem on:click={() => { $showAlbumSortOrder = true; menuIsOpen = false; }}>{$t("SORT_BY_ACTION")}</MenuItem>
          <MenuItem on:click={goToSettings}>{$t("SETTINGS_ACTION")}</MenuItem>
        </MenuButton>
      </div>
    </ViewHeader>
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedAlbums.length > 0}
      {#key $albumGridSize}
        {#if $albumGridSize === GridSize.LIST}
          <VirtualList
            name="albumsView"
            itemHeight={60}
            items={sortedAlbums}
            keyFunction={keyFunction}
            bind:isScrolled={$albumsIsScrolled}
            let:entry
          >
            <AlbumListEntry album={entry} detailType={$albumSortOrder} />
          </VirtualList>
        {:else}
          <VirtualGrid
            name="albumsView"
            itemHeight={GRID_IMAGE_DIMENSIONS[$albumGridSize].height + GRID_IMAGE_DIMENSIONS[$albumGridSize].infoHeight + 12}
            itemWidth={GRID_IMAGE_DIMENSIONS[$albumGridSize].width + 10}
            rowGap={GRID_IMAGE_DIMENSIONS[$albumGridSize].gap}
            columnGap={GRID_IMAGE_DIMENSIONS[$albumGridSize].gap}
            items={sortedAlbums}
            keyFunction={keyFunction}
            bind:isScrolled={$albumsIsScrolled}
            let:entry
          >
            <AlbumGridEntry album={entry} />
          </VirtualGrid>
        {/if}
      {/key}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="font-label message">{$t("NO_TYPE_FOUND_MESSAGE").replace("{type}", $t("ALBUM_PLURAL_VALUE"))}.</div>
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