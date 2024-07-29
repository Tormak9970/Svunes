<script lang="ts">
  import { Icon } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import Marquee from "@layout/Marquee.svelte";
  import ProgressControls from "./now-playing/ProgressControls.svelte";
  
  import Close from "@ktibow/iconset-material-symbols/close-rounded";
  import FavoriteOff from "@ktibow/iconset-material-symbols/favorite-outline-rounded";
  import FavoriteOn from "@ktibow/iconset-material-symbols/favorite-rounded";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Repeat from "@ktibow/iconset-material-symbols/repeat-rounded";
  import Shuffle from "@ktibow/iconset-material-symbols/shuffle-rounded";
  import SkipNext from "@ktibow/iconset-material-symbols/skip-next-rounded";
  import SkipPrevious from "@ktibow/iconset-material-symbols/skip-previous-rounded";
  import { showCarMode } from "@stores/Overlays";
  
  import { PlaybackController, QueueController } from "@controllers";
  import { t } from "@stores/Locale";
  import { isPaused, playingSongId, playlists, repeatPlayed, shuffle, songsMap } from "@stores/State";
  import { hash64, sharedAxisTransition } from "@utils";
  
  $: song = $playingSongId !== "" ? $songsMap[$playingSongId] : null;
  $: songLength = song?.length ?? 0;
  
  $: favoritesPlaylist = $playlists.find((playlist) => playlist.id === hash64("Favorites"));
  $: isFavorited = song?.id ? favoritesPlaylist?.songIds.includes(song?.id) : false;

  $: label = song?.title ?? song?.fileName;

  const disabledColor = "rgb(var(--m3-scheme-outline-variant))";
  const enabledColor = "rgb(var(--m3-scheme-primary))";

  function toggleFavorite() {
    if (isFavorited) {
      const index = favoritesPlaylist?.songIds.indexOf(song!.id)!;
      favoritesPlaylist?.songIds.splice(index, 1);
    } else {
      favoritesPlaylist?.songIds.push(song!.id);
    }
    
    $playlists = [ ...$playlists ];
  }

  function handlePlay() {
    if ($isPaused) {
      PlaybackController.resume();
    } else {
      PlaybackController.pause();
    }
  }
</script>

<div class="container" transition:sharedAxisTransition={{ direction: "Z", leaving: false }}>
  <div class="content">
    <div class="options">
      <div class="left" />
      <div class="center font-label-large">{$t("CAR_MODE_TITLE")}</div>
      <div class="right">
        <Button type="text" iconType="full" size="3.5rem" iconSize="2rem" on:click={() => $showCarMode = false}>
          <Icon icon={Close} />
        </Button>
      </div>
    </div>
    <div class="song-info">
      <div class="font-headline-large title">
        {#if label && label.length > 28}
          <div style="margin-left: 4%;">
            <Marquee speed={50} gap={100}>{label}</Marquee>
          </div>
        {:else}
          {label}
        {/if}
      </div>
      <div class="font-headline">{song?.artist ?? $t("UNKOWN_VALUE")}</div>
    </div>
    <ProgressControls songLength={songLength} />
    <div class="player-controls">
      <Button type="text" iconType="full" size="6rem" iconSize="4rem" on:click={QueueController.skipBack}>
        <Icon icon={SkipPrevious} />
      </Button>
      <Button type="filled" iconType="full" size="6rem" iconSize="4rem" on:click={handlePlay}>
        {#if !$isPaused}
          <Icon icon={Pause} />
        {:else}
          <Icon icon={Play} />
        {/if}
      </Button>
      <Button type="text" iconType="full" size="6rem" iconSize="4rem" on:click={QueueController.skip}>
        <Icon icon={SkipNext} />
      </Button>
    </div>
    <div class="player-controls">
      <Button type="text" iconType="full" size="5rem" iconSize="3rem" on:click={() => $repeatPlayed = !$repeatPlayed }>
        <div class="button-icon-wrapper" style:color={$repeatPlayed ? enabledColor : disabledColor}>
          <Icon icon={Repeat} />
        </div>
      </Button>
      <Button type="text" iconType="full" size="5rem" iconSize="3rem" on:click={toggleFavorite}>
        {#if !isFavorited}
          <Icon icon={FavoriteOff} />
        {:else}
          <Icon icon={FavoriteOn} />
        {/if}
      </Button>
      <Button type="text" iconType="full" size="5rem" iconSize="3rem" extraOptions={{ style: "display: flex;" }} on:click={() => $shuffle = !$shuffle }>
        <div class="button-icon-wrapper" style:color={$shuffle ? enabledColor : disabledColor}>
          <Icon icon={Shuffle} />
        </div>
      </Button>
    </div>
  </div>
</div>

<style>
  .container {
    height: 100%;
    width: calc(100% - 30px);
    padding: 0px 15px;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: absolute;

    color: rgb(var(--m3-scheme-on-background));
    
    background: rgb(var(--m3-scheme-background));

    z-index: 10;
  }

  .content {
    width: 100%;
    max-width: 370px;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .song-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    width: 100%;

    margin: 100px 0px;
    gap: 20px;

    font-size: 30px;
  }

  .title { font-weight: bold; max-width: 100%; }

  .player-controls {
    width: 100%;
    margin-top: 2rem;

    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .button-icon-wrapper {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left {
    height: 3.5rem;
    width: 3.5rem;
  }

  .center {
    font-weight: bold;
  }

  .options {
    position: absolute;
    top: 5px;
    left: 5px;

    width: calc(100% - 10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>