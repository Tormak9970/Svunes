<script lang="ts">
  import { tauri } from "@tauri-apps/api";
  import type { Playlist } from "../../../lib/models/Playlist";
  import { IMAGE_FADE_OPTIONS } from "../../../lib/utils/ImageConstants";
  import Lazy from "../../layout/Lazy.svelte";
  import AlbumPlaceholder from "../../layout/placeholders/AlbumPlaceholder.svelte";
  import Favorites from "../../layout/placeholders/Favorites.svelte";
  import { albumsMap, playlistGridSize } from "../../../stores/State";
  import { GridSize } from "../../../types/Settings";
    import PlaylistGrid from "./PlaylistGrid.svelte";

  export let playlist: Playlist;
  export let height: number;
  export let width: number;
  export let isList = false;

  $: albumKeys = Object.keys(playlist.albumArtLUT);
  $: numAlbums = albumKeys.length;
  $: albums = albumKeys.map((albumName) => $albumsMap[albumName]);
  
  $: convertedPath = albums[0]?.artPath ? tauri.convertFileSrc(albums[0].artPath) : "";
  $: size = isList ? 20 : ($playlistGridSize === GridSize.SMALL ? 40 : 60);
</script>

<div class="playlist-image" class:isList style="width: {width}px; height: {height}px;">
  {#if isList}
    {#if playlist.name === "Favorites"}
      <Favorites width={size} height={size} />
    {:else}
      <AlbumPlaceholder width={size} height={size} />
    {/if}
  {:else}
    {#if playlist.name === "Favorites"}
      <Favorites width={size} height={size} />
    {:else if numAlbums === 0}
      <AlbumPlaceholder width={size} height={size} />
    {:else if numAlbums === 1}
      <Lazy height={height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="{convertedPath}" style="width: {width}px; height: {height}px;" draggable="false" on:error={onError} />
        <span slot="placeholder">
          <AlbumPlaceholder width={size} height={size} />
        </span>
      </Lazy>
    {:else}
      <PlaylistGrid albums={albums} />
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