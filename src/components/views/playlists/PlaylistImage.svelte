<script lang="ts">
  import Lazy from "@layout/Lazy.svelte";
  import AlbumPlaceholder from "@layout/placeholders/AlbumPlaceholder.svelte";
  import Favorites from "@layout/placeholders/Favorites.svelte";
  import type { Playlist } from "@models";
  import { albumsMap, songsMap } from "@stores/State";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { IMAGE_FADE_OPTIONS } from "@utils";
  import PlaylistGrid from "./PlaylistGrid.svelte";

  export let playlist: Playlist;
  export let height: number;
  export let width: number;

  $: chosenImagePath = playlist?.imagePath ? convertFileSrc(playlist.imagePath) : undefined;

  let albumArtLUT: Record<string, number> = {};

  $: if (playlist.songIds) {
    albumArtLUT = {};

    for (const songName of playlist.songIds) {
      const song = $songsMap[songName];

      if (song?.album) {
        if (!albumArtLUT[song.album]) albumArtLUT[song.album] = 0;
  
        albumArtLUT[song.album] += 1;
      }
    }
  }

  $: albumKeys = Object.keys(albumArtLUT);
  $: images = albumKeys.map((albumName) => $albumsMap[albumName].artPath);
  
  $: convertedPath = images[0] ? convertFileSrc(images[0]) : "";
  
  $: gap = 0.05 * width;
  $: gridSize = 0.4 * width;
  $: iconSize = Math.max(Math.floor(width / 50) * 20, 20);
</script>

<div class="playlist-image" class:isList={width <= 40} style="width: {width}px; height: {height}px;">
  {#if width <= 40}
    {#if playlist.name === "Favorites"}
      <Favorites width={iconSize} height={iconSize} />
    {:else if chosenImagePath}
      <Lazy height={height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{chosenImagePath}" style="width: {height}px; height: {height}px;" draggable="false" on:error={onError} />
        <span slot="placeholder">
          <AlbumPlaceholder width={iconSize} height={iconSize} />
        </span>
      </Lazy>
    {:else}
      <AlbumPlaceholder width={iconSize} height={iconSize} />
    {/if}
  {:else}
    {#if playlist.name === "Favorites"}
      <Favorites width={iconSize} height={iconSize} />
    {:else if chosenImagePath}
      <Lazy height={height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{chosenImagePath}" style="width: {height}px; height: {height}px;" draggable="false" on:error={onError} />
        <span slot="placeholder">
          <AlbumPlaceholder width={iconSize} height={iconSize} />
        </span>
      </Lazy>
    {:else if images.length === 0}
      <AlbumPlaceholder width={iconSize} height={iconSize} />
    {:else if images.length === 1}
      <Lazy height={height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{convertedPath}" style="width: {height}px; height: {height}px;" draggable="false" on:error={onError} />
        <span slot="placeholder">
          <AlbumPlaceholder width={iconSize} height={iconSize} />
        </span>
      </Lazy>
    {:else}
      <PlaylistGrid images={images} size={gridSize} gap={gap} iconSize={iconSize / 2} />
    {/if}
  {/if}
</div>

<style>
  .playlist-image {
    border-radius: 10px;
    overflow: hidden;
  }

  .isList {
    border-radius: 4px;
  }
</style>