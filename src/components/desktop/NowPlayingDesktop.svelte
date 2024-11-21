<script lang="ts">
  import { Icon, MediaQuery } from "@component-utils";
  import { PlaybackController } from "@controllers";
  import { tooltip } from "@directives";
  import { FavoriteOff, FavoriteOn, MoreVert, PictureInPicture, PictureInPictureExit, QueueMusic, Speaker, VolumeDown, VolumeOff, VolumeUp } from "@icons";
  import { Button, MenuButton } from "@interactables";
  import { Marquee, MenuItem } from "@layout";
  import { showPopoutPlayer } from "@stores/Layout";
  import { t } from "@stores/Locale";
  import { showAddToPlaylist, showNowPlaying } from "@stores/Overlays";
  import { albumsMap, playingSongId, playlists, songsMap, volumeLevel } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { goToQueue, goToSongDetails, hash64 } from "@utils";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import PlayerControls from "../overlays/now-playing/PlayerControls.svelte";
  import ProgressControls from "../overlays/now-playing/ProgressControls.svelte";
  import ViewImage from "../utils/ViewImage.svelte";
  import DesktopSpeakerSelect from "./DesktopSpeakerSelect.svelte";
  import DesktopVolumeControls from "./DesktopVolumeControls.svelte";

  let menuIsOpen = false;

  let hideTogglePopout = false;
  let hideQueue = false;
  
  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;
  $: label = song?.title ?? song?.fileName;
  $: album = song?.album ? $albumsMap[song?.album] : undefined;

  $: favoritesPlaylist = $playlists.find((playlist) => playlist.id === hash64("Favorites"));
  $: isFavorited = song?.id ? favoritesPlaylist?.songIds.includes(song?.id) : false;

  $: isMp3 = song?.fileName.toLocaleLowerCase().endsWith("mp3");
  $: songLength = song?.length ?? 0;

  $: imagePath = convertFileSrc(song?.artPath ?? "");

  $: highlightColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";

  function toggleFavorite() {
    if (isFavorited) {
      const index = favoritesPlaylist?.songIds.indexOf(song!.id)!;
      favoritesPlaylist?.songIds.splice(index, 1);
    } else {
      favoritesPlaylist?.songIds.push(song!.id);
    }
    
    $playlists = [ ...$playlists ];
  }

  function clearNowPlaying() {
    $showNowPlaying = false;
    PlaybackController.resetNowPlaying();
  }

  
  /**
   * Shows the song's album.
   */
  function goToAlbum() {
    push(`/albums/${song!.album!}`);
    menuIsOpen = false;
  }

  /**
   * Shows the song's artist.
   */
  function goToArtist() {
    push(`/artists/${song!.artist!}`);
    menuIsOpen = false;
  }

  function goToSong() {
    goToSongDetails(song!.id);
  }

  function handleTooltipShow(e: Event) {
    (e.target as HTMLButtonElement).parentElement?.click();
  }

  onMount(() => {
    if (album && highlightColor === "var(--m3-scheme-surface-container-low)") {
      album.setBackgroundFromImage().then(() => {
        highlightColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
      });
    }
  });
</script>

<MediaQuery query="(max-width: 1000px)" bind:matches={hideQueue} />
<MediaQuery query="(max-width: 1100px)" bind:matches={hideTogglePopout} />
<div class="now-playing-desktop">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="song-info-container" on:click={goToSong}>
    <ViewImage
      src={imagePath}
      width={70}
      height={70}
      borderRadius="5px"
      iconSize={40}
    />
    <div class="song-info">
      {#key label}
        <Marquee speed={40} gap={80}>
          <div class="title">{label}</div>
        </Marquee>
      {/key}
      <div class="font-body artist">{song?.artist ?? $t("UNKOWN_VALUE")}</div>
    </div>
  </div>
  <div class="player-controls">
    <div style="width: 14rem">
      <PlayerControls />
    </div>
     <ProgressControls songLength={songLength} />
  </div>
  <div class="extra-controls">
    <Button type="text" iconType="full" on:click={toggleFavorite}>
      {#if !isFavorited}
        <Icon icon={FavoriteOff} />
      {:else}
        <Icon icon={FavoriteOn} />
      {/if}
    </Button>
    {#if !hideQueue}
      <Button type="text" iconType="full" on:click={goToQueue}>
        <Icon icon={QueueMusic} width="20px" height="20px" />
      </Button>
    {/if}
    {#if !hideTogglePopout}
      <Button type="text" iconType="full" on:click={() => $showPopoutPlayer = !$showPopoutPlayer}>
        <Icon icon={$showPopoutPlayer ? PictureInPictureExit : PictureInPicture} width="20px" height="20px" />
      </Button>
    {/if}
    <span
      use:tooltip={{
        tooltipId: 1,
        content: { component: DesktopSpeakerSelect },
        action: "click",
        hideOnClickOutside: true,
        theme: "speakers-tooltip-theme",
        arrow: false
      }}
    >
      <Button type="text" iconType="full" on:click={handleTooltipShow}>
        <Icon icon={Speaker} width="20px" height="20px" />
      </Button>
    </span>
    <span
      use:tooltip={{
        tooltipId: 2,
        content: { component: DesktopVolumeControls },
        action: "click",
        hideOnClickOutside: true,
        theme: "volume-tooltip-theme",
        arrow: false
      }}
    >
      <Button type="text" iconType="full" on:click={handleTooltipShow}>
        <Icon icon={$volumeLevel === 0 ? VolumeOff : ($volumeLevel <= 0.5 ? VolumeDown : VolumeUp)} width="20px" height="20px" />
      </Button>
    </span>
    <MenuButton icon={MoreVert} bind:open={menuIsOpen}>
      <MenuItem on:click={() => { $showAddToPlaylist = true; menuIsOpen = false; }}>{$t("ADD_TO_PLAYLIST_ACTION")}</MenuItem>
      {#if song?.album}
        <MenuItem on:click={goToAlbum}>{$t("GO_TO_ALBUM_ACTION")}</MenuItem>
      {/if}
      {#if song?.artist}
        <MenuItem on:click={goToArtist}>{$t("GO_TO_ARTIST_ACTION")}</MenuItem>
      {/if}
      {#if hideQueue}
        <MenuItem on:click={goToQueue}>{$t("GO_TO_QUEUE_ACTION")}</MenuItem>
      {/if}
      <MenuItem on:click={clearNowPlaying}>{$t("CLEAR_QUEUE_ACTION")}</MenuItem>
      {#if hideTogglePopout}
        <MenuItem on:click={() => $showPopoutPlayer = !$showPopoutPlayer}>{$t($showPopoutPlayer ? "CLOSE_POPOUT_ACTION" : "OPEN_POPOUT_ACTION")}</MenuItem>
      {/if}
    </MenuButton>
  </div>
</div>

<style>
  .now-playing-desktop {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .song-info-container {
    min-width: 15rem;
    max-width: 20rem;
    padding: 0.25rem;

    display: flex;
    align-items: center;

    cursor: pointer;

    border-radius: 10px;
    background-color: transparent;

    transition: background-color 200ms;
  }
  .song-info-container:hover {
    background-color: rgb(var(--m3-scheme-primary) / 0.08);
  }

  .song-info {
    width: calc(100% - 1rem - 70px);
    margin-left: 1rem;
  }

  .title {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .artist {
    width: 100%;
    text-wrap: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .player-controls {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 28rem;
    margin: 0 0.5rem;
    height: 4.5rem;
  }

  .extra-controls {
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }
</style>