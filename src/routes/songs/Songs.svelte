<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
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
  import type { Song } from "@lib/models/Song";
  import { GRID_IMAGE_DIMENSIONS } from "@lib/utils/ImageConstants";
  import { dateSort, stringSort } from "@lib/utils/Sorters";
  import { t } from "@stores/Locale";
  import { showGridSize, showSongSortOrder } from "@stores/Modals";
  import { selectedChips } from "@stores/Search";
  import { lastView, selectedView, songGridSize, songs, songsIsAtTop, songSortOrder } from "@stores/State";
  import SongGridEntry from "@views/songs/SongGridEntry.svelte";
  import SongListEntry from "@views/songs/SongListEntry.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
  import { afterUpdate } from "svelte";
  import { push } from "svelte-spa-router";
  import { type SongSortOrder, GridSize } from "../../types/Settings";
  import { View } from "../../types/View";

  const keyFunction = (entry: { data: Song }) => entry.data.filePath;

  let gridSize = $songGridSize;
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
    $selectedChips = [ "song" ];
    push("/search");
  }

  /**
   * Sorts the songs.
   * @param songsList The list of songs.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortSongs(songsList: Song[], sortOrder: SongSortOrder): Song[] {
    let sorted: Song[] = [];
    if (sortOrder === "Alphabetical") {
      sorted = songsList.sort(stringSort<Song>("title"));
    } else if (sortOrder === "Album") {
      sorted = songsList.sort(stringSort<Song>("album"));
    } else if (sortOrder === "Artist") {
      sorted = songsList.sort(stringSort<Song>("artist"));
    } else if (sortOrder === "Year") {
      sorted = songsList.sort((a: Song, b: Song) => b.releaseYear - a.releaseYear);
    } else if (sortOrder === "Most Played") {
      sorted = songsList.sort((a: Song, b: Song) => b.numTimesPlayed - a.numTimesPlayed);
    } else if (sortOrder === "Last Played") {
      sorted = songsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: sortedSongs = sortSongs($songs, $songSortOrder);
  
  afterUpdate(() => {
    if ($songGridSize !== gridSize) {
      gridSize = $songGridSize;
      $songsIsAtTop = true;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <ViewHeader title={$t("SONGS_TITLE")} highlight={!$songsIsAtTop}>
      <div slot="left">
        <Button type="text" iconType="full" on:click={openSearch}>
          <Icon icon={Search} width="20px" height="20px" />
        </Button>
      </div>
      <div slot="right">
        <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
          <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>{$t("GRID_SIZE_ACTION")}</MenuItem>
          <MenuItem on:click={() => { $showSongSortOrder = true; menuIsOpen = false; }}>{$t("SORT_BY_ACTION")}</MenuItem>
          <MenuItem on:click={goToSettings}>{$t("SETTINGS_ACTION")}</MenuItem>
        </MenuButton>
      </div>
    </ViewHeader>
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedSongs.length > 0}
      {#if $songGridSize === GridSize.LIST}
        <VirtualList
          name="songsView"
          itemHeight={60}
          items={sortedSongs}
          keyFunction={keyFunction}
          bind:isAtTop={$songsIsAtTop}
          let:entry
        >
          <SongListEntry song={entry} detailType={$songSortOrder} />
        </VirtualList>
      {:else}
        <VirtualGrid
          name="songsView"
          itemHeight={GRID_IMAGE_DIMENSIONS[$songGridSize].height + GRID_IMAGE_DIMENSIONS[$songGridSize].infoHeight + 12}
          itemWidth={GRID_IMAGE_DIMENSIONS[$songGridSize].width + 10}
          rowGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap}
          columnGap={GRID_IMAGE_DIMENSIONS[$songGridSize].gap}
          items={sortedSongs} keyFunction={keyFunction}
          bind:isAtTop={$songsIsAtTop}
          let:entry
        >
          <SongGridEntry song={entry} />
        </VirtualGrid>
      {/if}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="font-label message">{$t("NO_TYPE_FOUND_MESSAGE").replace("{type}", $t("SONG_PLURAL_VALUE"))}.</div>
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