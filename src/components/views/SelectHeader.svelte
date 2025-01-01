<script lang="ts">
  import { Icon } from "@component-utils";
  import { getSelectContextMenuItems } from "@context-menus";
  import { LogController, QueueController } from "@controllers";
  import { AddToQueue, BackArrow, MoreVert, PlaylistAdd, PlaylistRemove, RemoveFromQueue } from "@icons";
  import { Button, MenuButton } from "@interactables";
  import { t } from "@stores/Locale";
  import { showAddToPlaylist, showQueue } from "@stores/Overlays";
  import { selected } from "@stores/Select";
  import { playlists, playlistsMap, queue, selectedView, showInfoSnackbar } from "@stores/State";
  import { View } from "@types";
  import { location } from "svelte-spa-router";
  import { fly } from "svelte/transition";

  /**
   * Queues the selected items.
   */
  function addToQueue() {
    switch ($selectedView) {
      case View.PLAYLISTS: {
        if ($location === "/playlists") {
          QueueController.queuePlaylists($selected);
        } else {
          QueueController.queueSongs($selected);
        }
        break;
      }
      case View.ALBUMS: {
        if ($location === "/albums") {
          QueueController.queueAlbums($selected);
        } else {
          QueueController.queueSongs($selected);
        }
        break;
      }
      case View.ARTISTS: {
        if ($location === "/artists") {
          QueueController.queueArtists($selected);
        } else {
          QueueController.playSongsNext($selected);
        }
        break;
      }
      case View.SONGS:
      case View.SEARCH:
      case View.GENRES: {
        QueueController.queueSongs($selected);
        break;
      }
      case View.HOME:
      case View.SETTINGS: {
        LogController.error("Shouldn't be able to get here!");
        break;
      }
    }
    
    $selected = [];
  }

  /**
   * Removes the selected items from the queue.
   */
  function removeFromQueue() {
    // * This is important because it accounts for if the elements were selected out of order.
    const selectedItems = $selected.sort((a: string, b: string) => {
      const aIndex = parseInt(a.split("|")[1]);
      const bIndex = parseInt(b.split("|")[1]);

      return bIndex - aIndex;
    });

    const queueList = $queue;

    for (const merged of selectedItems) {
      const [_, index] = merged.split("|");

      queueList.splice(parseInt(index), 1);
    }

    $queue = [...queueList];
    $selected = [];
  }

  /**
   * Removes the selected songs from this playlist.
   * @param selectedItems The selected items.
   */
  function removeFromPlaylist() {
    const playlistId = $location.substring(11);
    const playlist = $playlistsMap[playlistId];
    
    for (const id of $selected) {
      playlist.removeSong(id);
    }

    $playlists = [...$playlists];

    $showInfoSnackbar({
      message: `${$t("REMOVED_VALUE")} ${$selected.length} ${$selected.length === 1 ? $t("SONG_SINGULAR_VALUE") : $t("SONG_PLURAL_VALUE")}`
    });

    selected.set([]);
  }
  
  let menuIsOpen = false;

  /**
   * Handles closing the options.
   */
  function closeOptions() {
    menuIsOpen = false;
  }

  $: selectHeaderMenuItems = getSelectContextMenuItems($selected, $t, $location);
</script>

<dialog open class="select-header" transition:fly={{ y: -50, duration: 250 }}>
  <div class="left">
    <Button type="text" iconType="full" on:click={() => { $selected = []; closeOptions(); }}>
      <Icon icon={BackArrow} width="36px" height="36px" />
    </Button>
  </div>
  <div class="title">
    {$selected.length} {$t("SELECTED_VALUE")}
  </div>
  <div class="right">
    {#if $showQueue}
      <Button type="text" iconType="full" on:click={removeFromQueue}>
        <Icon icon={RemoveFromQueue} width="36px" height="36px" />
      </Button>
    {:else}
      <Button type="text" iconType="full" on:click={addToQueue}>
        <Icon icon={AddToQueue} width="36px" height="36px" />
      </Button>
    {/if}
    {#if $location.startsWith("/playlists/")}
      <Button type="text" iconType="full" on:click={removeFromPlaylist}>
        <Icon icon={PlaylistRemove} width="36px" height="36px" />
      </Button>
    {/if}
    <Button type="text" iconType="full" on:click={() => $showAddToPlaylist = true}>
      <Icon icon={PlaylistAdd} width="36px" height="36px" />
    </Button>
    <MenuButton icon={MoreVert} items={selectHeaderMenuItems} />
  </div>
</dialog>

<style>
  .select-header {
    border: 0;
    padding: 5px 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    color: rgb(var(--m3-scheme-on-background));
    background-color: rgb(var(--m3-scheme-surface-container-highest));

    position: absolute;
    top: 0;

    z-index: 3;
  }

  .select-header::backdrop {
    display: none;
  }

  .title {
    font-size: 20px;
  }

  .left {
    height: 100%;
    margin-left: 10px;
  }

  .right {
    height: 100%;
    margin-right: 10px;

    display: flex;
  }
</style>