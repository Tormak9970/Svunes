<script lang="ts">
  import DetailsBody from "@component-utils/DetailsBody.svelte";
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import BackArrow from "@ktibow/iconset-material-symbols/arrow-back-rounded";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import VirtualList from "@layout/VirtualList.svelte";
  import { PlaybackController } from "@lib/controllers/PlaybackController";
  import { QueueController } from "@lib/controllers/QueueController";
  import type { Song } from "@lib/models/Song";
  import { shuffleSongs } from "@lib/utils/Shuffle";
  import OverlayHeader from "@overlays/utils/OverlayHeader.svelte";
  import { isPaused, nowPlayingList, songs, songsMap } from "@stores/State";
  import ListEntry from "@views/songs/ListEntry.svelte";
  import PlayButton from "@views/utils/PlayButton.svelte";
  import { pop } from "svelte-spa-router";

  const keyFunction = (entry: { data: Song }) => `${entry.data.artPath}${entry.data.title}${entry.data.album}${entry.data.artist}${entry.data.releaseYear}${entry.data.lastPlayedOn}`;

  $: lastPlayedSongs = [ ...$songs ].filter((song) => song.lastPlayedOn !== "Never").sort((a, b) => Date.parse(b.lastPlayedOn) - Date.parse(a.lastPlayedOn));
  $: limited = lastPlayedSongs.length > 100 ? lastPlayedSongs.slice(0, 100) : lastPlayedSongs;

  let isAtTop = true;

  /**
   * Plays the songs.
   */
  function playSongs() {
    if ($nowPlayingList === "last-played") {
      if (!$isPaused) {
        PlaybackController.pause();
      } else {
        PlaybackController.resume();
      }
    } else {
      const first = limited[0];
      PlaybackController.playSong(first);
      QueueController.queueSongs(limited.slice(1).map((song) => song.id));
      $nowPlayingList = "last-played";
    }
  }
  
  /**
   * Shuffles then plays the songs.
   */
  function playShuffled() {
    const shuffled = shuffleSongs(limited.map((song) => song.id));
    const first = $songsMap[shuffled[0]];
    PlaybackController.playSong(first);
    QueueController.queueSongs(shuffled.slice(1));
    $nowPlayingList = "last-played";
  }
</script>

<DetailsBody bind:isAtTop={isAtTop}>
  <span slot="header">
    <OverlayHeader highlight={!isAtTop}>
      <span slot="left" style="display: flex; align-items: center; gap: 10px;">
        <Button type="text" iconType="full" on:click={pop}>
          <Icon icon={BackArrow} width="20px" height="20px" />
        </Button>
        <div style="font-size: 20px;">History</div>
      </span>
      <span slot="right" style="display: flex; flex-direction: row; gap: 5px">
        <PlayButton type="text" name="recently-added" on:click={playSongs} />
        <Button type="text" iconType="full" on:click={playShuffled}>
          <Icon icon={Shuffle} width="20px" height="20px" />
        </Button>
      </span>
    </OverlayHeader>
  </span>
  <span class="content" slot="content">
    {#if lastPlayedSongs.length > 0}
      <VirtualList name="lastPlayed" saveState={false} itemHeight={60} items={limited} keyFunction={keyFunction} bind:isAtTop={isAtTop} let:entry>
        <ListEntry song={entry} detailType="Alphabetical" />
      </VirtualList>
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="message">You haven't played any songs yet.</div>
      </div>
    {/if}
  </span>
</DetailsBody>

<style>
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 70px;
  }
  
  .message-container {
    margin-top: 40%;
    color: rgb(var(--m3-scheme-on-secondary));
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>