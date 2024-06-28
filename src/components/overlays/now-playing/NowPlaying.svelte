<script lang="ts">
  import { onMount } from "svelte";
  import { albumsMap, nowPlayingTheme, playingSongId, playlists, songsMap } from "../../../stores/State";
  import Card from "./themes/Card.svelte";
  import Full from "./themes/Full.svelte";
  import Normal from "./themes/Normal.svelte";
  import Simple from "./themes/Simple.svelte";
  import { tauri } from "@tauri-apps/api";

  export let clampedHeight: number;

  const layouts = [ Normal, Card, Simple, Full ];

  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;
  $: album = song?.album ? $albumsMap[song?.album] : undefined;

  $: favoritesPlaylist = $playlists.find((playlist) => playlist.name === "Favorites");
  $: isFavorited = song?.id ? favoritesPlaylist?.songIds.includes(song?.id) : false;
  
  $: convertedPath = song?.artPath ? tauri.convertFileSrc(song?.artPath) : "";

  $: isMp3 = song?.fileName.toLocaleLowerCase().endsWith("mp3");

  $: topBackgroundColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
  const bottomBackgroundColor = "var(--m3-scheme-background)";

  function toggleFavorite() {
    if (isFavorited) {
      const index = favoritesPlaylist?.songIds.indexOf(song!.id)!;
      favoritesPlaylist?.songIds.splice(index, 1);
    } else {
      favoritesPlaylist?.songIds.push(song!.id);
    }
    
    $playlists = [ ...$playlists ];
  }

  onMount(async () => {
    if (album && topBackgroundColor === "var(--m3-scheme-surface-container-low)") {
      await album.setBackgroundFromImage();
      topBackgroundColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
    }
  });
</script>

<div class="full-screen-overlay" style:opacity={(-1 * clampedHeight) / 20}>
  <svelte:component this={layouts[$nowPlayingTheme]} song={song} isFavorited={isFavorited} isMp3={isMp3} convertedPath={convertedPath} topBackgroundColor={topBackgroundColor} bottomBackgroundColor={bottomBackgroundColor} toggleFavorite={toggleFavorite} />
</div>

<style>
  .full-screen-overlay {
    width: 100%;
    height: 100%;

    background-color: rgb(var(--m3-scheme-background));
  }
</style>