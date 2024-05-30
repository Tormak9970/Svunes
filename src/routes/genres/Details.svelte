<script lang="ts">
  import Button from "../../components/interactables/Button.svelte";
  import Icon from "../../components/utils/Icon.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import MoreVert from "@ktibow/iconset-material-symbols/more-vert";
  import { genresMap, songsMap, isPaused, nowPlayingListName } from "../../stores/State";
  import { genreToAdd, showAddToPlaylist } from "../../stores/Overlays";
  import { PlaybackController } from "../../lib/controllers/PlaybackController";
  import { QueueController } from "../../lib/controllers/QueueController";
  import DetailsBody from "../../components/utils/DetailsBody.svelte";
  import OverlayHeader from "../../components/overlays/utils/OverlayHeader.svelte";
  import MenuButton from "../../components/interactables/MenuButton.svelte";
  import { pop } from "svelte-spa-router";
  import MenuItem from "../../components/layout/MenuItem.svelte";
  import VirtualList from "../../components/layout/VirtualList.svelte";
  import ListEntry from "../../components/views/songs/ListEntry.svelte";
  import type { Song } from "../../lib/models/Song";
  import PlayButton from "../../components/views/utils/PlayButton.svelte";

  const keyFunction = (entry: { data: Song }) => `${entry.data.artPath}${entry.data.title}${entry.data.album}${entry.data.artist}${entry.data.releaseYear}${entry.data.lastPlayedOn}`;

  export let params: { key?: string } = {};
  $: genre = params.key ? $genresMap[params.key] : undefined;
  $: genreSongs = genre?.songKeys.map((key) => $songsMap[key]) ?? [];

  let isAtTop = true;

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
    if (!$isPaused && $nowPlayingListName === genre!.name) {
      $isPaused = true;
    } else {
      $isPaused = false;
      $nowPlayingListName = genre!.name;
      PlaybackController.playGenre(genre!);
    }
  }

  /**
   * Plays this genre next.
   */
  function playNext() {
    QueueController.playSongsNext(genre!.songKeys);
  }

  /**
   * Queues this genre.
   */
  function queueGenre() {
    QueueController.queueSongs(genre!.songKeys);
  }

  /**
   * Opens the add to playlist dialog with this artist set to be added.
   */
  function addToPlaylist() {
    $genreToAdd = genre!.name;
    $showAddToPlaylist = true;
  }
</script>

<DetailsBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={back}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">{genre?.name}</div>
      </span>
      <span slot="right" style="display: flex; flex-direction: row; gap: 5px">
        <PlayButton type={"text"} name={genre?.name} on:click={playGenre} />
        <MenuButton icon={MoreVert}>
          <MenuItem on:click={playNext}>Play Next</MenuItem>
          <MenuItem on:click={queueGenre}>Add to Queue</MenuItem>
          <MenuItem on:click={addToPlaylist}>Add to Playlist</MenuItem>
        </MenuButton>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    <VirtualList name="genreDetails" saveState={false} itemHeight={60} items={genreSongs} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
      <ListEntry song={entry} />
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
    padding-bottom: 40px;
  }
</style>