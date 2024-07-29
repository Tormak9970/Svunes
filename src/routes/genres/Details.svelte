<script lang="ts">
  import { DetailsBody, Icon, OverlayHeader } from "@component-utils";
  import { PlaybackController, QueueController } from "@controllers";
  import { Button, MenuButton, PlayButton } from "@interactables";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { MenuItem, VirtualList } from "@layout";
  import type { Song } from "@models";
  import { t } from "@stores/Locale";
  import { genreToAdd, showAddToPlaylist } from "@stores/Overlays";
  import { genresMap, isPaused, nowPlayingList, songsMap } from "@stores/State";
  import SongListEntry from "@views/songs/SongListEntry.svelte";
  import { pop } from "svelte-spa-router";

  const keyFunction = (entry: { data: Song }) => entry.data.id;

  export let params: { key?: string } = {};
  $: genre = params.key ? $genresMap[params.key] : undefined;
  $: genreSongs = genre?.songIds.map((id) => $songsMap[id]) ?? [];

  let highlight = false;

  /**
   * Closes the details overlay.
   */
  function back() {
    pop();
  }

  /**
   * Plays this genre.
   */
  function playGenre() {
    if ($nowPlayingList === genre!.name) {
      if (!$isPaused) {
        PlaybackController.pause();
      } else {
        PlaybackController.resume();
      }
    } else {
      PlaybackController.playGenre(genre!);
    }
  }

  /**
   * Plays this genre next.
   */
  function playNext() {
    QueueController.playGenresNext([genre!.name]);
  }

  /**
   * Queues this genre.
   */
  function queueGenre() {
    QueueController.queueGenres([genre!.name]);
  }

  /**
   * Opens the add to playlist dialog with this artist set to be added.
   */
  function addToPlaylist() {
    $genreToAdd = genre!.name;
    $showAddToPlaylist = true;
  }
</script>

<DetailsBody>
  <span slot="header">
    <OverlayHeader highlight={highlight}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">{genre?.name}</div>
      </span>
      <span slot="right" style="display: flex; flex-direction: row; gap: 5px">
        <PlayButton type="text" name={genre?.name} on:click={playGenre} />
        <MenuButton icon={MoreVert}>
          <MenuItem on:click={playNext}>{$t("PLAY_NEXT_ACTION")}</MenuItem>
          <MenuItem on:click={queueGenre}>{$t("ADD_TO_QUEUE_ACTION")}</MenuItem>
          <MenuItem on:click={addToPlaylist}>{$t("ADD_TO_PLAYLISTS_ACTION")}</MenuItem>
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <VirtualList name="genreDetails" saveState={false} itemHeight={60} items={genreSongs} keyFunction={keyFunction} bind:isScrolled={highlight} let:entry>
      <SongListEntry song={entry} detailType="Alphabetical" />
    </VirtualList>
  </span>
</DetailsBody>

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>