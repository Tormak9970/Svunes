<script lang="ts">
  import { Icon, ViewContainer } from "@component-utils";
  import { AppController, LogController } from "@controllers";
  import { Add, MoreVert, Search } from "@icons";
  import { Button, MenuButton } from "@interactables";
  import { MenuItem, ViewHeader, VirtualGrid, VirtualList } from "@layout";
  import type { Playlist } from "@models";
  import { t } from "@stores/Locale";
  import { showGridSize, showPlaylistSortOrder } from "@stores/Modals";
  import { showCreatePlaylist } from "@stores/Overlays";
  import { selectedChips } from "@stores/Search";
  import { lastView, playlistGridSize, playlists, playlistsIsScrolled, playlistSortOrder, selectedView } from "@stores/State";
  import * as dialog from "@tauri-apps/plugin-dialog";
  import { type PlaylistSortOrder, GridSize, View } from "@types";
  import { dateSort, GRID_IMAGE_DIMENSIONS, stringSort } from "@utils";
  import PlaylistGridEntry from "@views/playlists/PlaylistGridEntry.svelte";
  import PlaylistListEntry from "@views/playlists/PlaylistListEntry.svelte";
  import { afterUpdate } from "svelte";
  import { push } from "svelte-spa-router";

  const keyFunction = (entry: { data: Playlist }) => `${entry.data.name}${entry.data.songIds.length}${entry.data.numTimesPlayed}${entry.data.lastPlayedOn}`;

  let gridSize = $playlistGridSize;
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
    $selectedChips = [ "playlist" ];
    push("/search");
  }

  /**
   * Prompts the user to import a playlist.
   */
  async function importPlaylist() {
    const file = await dialog.open({
      title: $t("CHOOSE_PLAYLIST_MESSAGE"),
      directory: false,
      multiple: false,
      filters: [
        {
          "name": $t("PLAYLIST_SINGULAR_VALUE"),
          "extensions": [ "json" ]
        }
      ]
    });

    if (file && file.path !== "") {
      AppController.importPlaylist(file.path);
    }
  }

  /**
   * Sorts the playlists.
   * @param playlistsList The list of playlists.
   * @param sortOrder The order to sort by.
   * @returns The sorted list.
   */
  function sortPlaylists(playlistsList: Playlist[], sortOrder: PlaylistSortOrder): Playlist[] {
    let sorted: Playlist[] = [];

    if (sortOrder === "Alphabetical") {
      sorted = playlistsList.sort(stringSort<Playlist>("name"));
    } else if (sortOrder === "Song Count") {
      sorted = playlistsList.sort((a: Playlist, b: Playlist) => b.songIds.length - a.songIds.length);
    } else if (sortOrder === "Most Played") {
      sorted = playlistsList.sort((a: Playlist, b: Playlist) => b.numTimesPlayed - a.numTimesPlayed);
    } else if (sortOrder === "Last Played") {
      sorted = playlistsList.sort(dateSort("lastPlayedOn"));
    } else {
      LogController.error("Unkown song sort order!");
      sorted = [];
    }
    return sorted;
  }

  $: pinned = $playlists.filter((playlist) => playlist.pinned);
  $: sortedPinned = sortPlaylists(pinned, $playlistSortOrder);
  $: unPinned = $playlists.filter((playlist) => !playlist.pinned);
  $: sortedUnPinned = sortPlaylists(unPinned, $playlistSortOrder);

  $: sortedPlaylists = [ ...sortedPinned, ...sortedUnPinned ];
  
  afterUpdate(() => {
    if ($playlistGridSize !== gridSize) {
      gridSize = $playlistGridSize;
      $playlistsIsScrolled = false;
    }
  });
</script>

<ViewContainer>
  <div slot="header">
    <ViewHeader title={$t("PLAYLISTS_TITLE")} highlight={$playlistsIsScrolled}>
      <div slot="left">
        <Button type="text" iconType="full" on:click={openSearch}>
          <Icon icon={Search} width="20px" height="20px" />
        </Button>
      </div>
      <div slot="right" style="display: flex; align-items: center;">
        <Button type="text" iconType="full" on:click={() => { $showCreatePlaylist = true; }}>
          <Icon icon={Add} width="20px" height="20px" />
        </Button>
        <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
          <MenuItem on:click={() => { $showGridSize = true; menuIsOpen = false; }}>{$t("GRID_SIZE_ACTION")}</MenuItem>
          <MenuItem on:click={() => { $showPlaylistSortOrder = true; menuIsOpen = false; }}>{$t("SORT_BY_ACTION")}</MenuItem>
          <MenuItem on:click={importPlaylist}>{$t("IMPORT_ACTION")}</MenuItem>
          <MenuItem on:click={goToSettings}>{$t("SETTINGS_ACTION")}</MenuItem>
        </MenuButton>
      </div>
    </ViewHeader>
  </div>
  <div slot="content" style="height: 100%; width: 100%;">
    {#if sortedPlaylists.length > 0}
      {#if $playlistGridSize === GridSize.LIST}
        <VirtualList
          name="playlistsView"
          itemHeight={60}
          items={sortedPlaylists}
          keyFunction={keyFunction}
          bind:isScrolled={$playlistsIsScrolled}
          let:entry
        >
          <PlaylistListEntry playlist={entry} detailType={$playlistSortOrder} />
        </VirtualList>
      {:else}
        <VirtualGrid
          name="playlistsView"
          itemHeight={GRID_IMAGE_DIMENSIONS[$playlistGridSize].height + GRID_IMAGE_DIMENSIONS[$playlistGridSize].infoHeight + 12}
          itemWidth={GRID_IMAGE_DIMENSIONS[$playlistGridSize].width + 10}
          rowGap={GRID_IMAGE_DIMENSIONS[$playlistGridSize].gap}
          columnGap={GRID_IMAGE_DIMENSIONS[$playlistGridSize].gap}
          items={sortedPlaylists}
          keyFunction={keyFunction}
          bind:isScrolled={$playlistsIsScrolled}
          let:entry
        >
          <PlaylistGridEntry playlist={entry} />
        </VirtualGrid>
      {/if}
    {/if}
  </div>
</ViewContainer>