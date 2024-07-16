<script lang="ts">
  import { hash64 } from "@lib/utils/Utils";
  import { albumsMap, nowPlayingTheme, playingSongId, playlists, songsMap } from "@stores/State";
  import { tauri } from "@tauri-apps/api";
  import { onMount } from "svelte";
  import Card from "./themes/Card.svelte";
  import Full from "./themes/Full.svelte";
  import Normal from "./themes/Normal.svelte";
  import Simple from "./themes/Simple.svelte";

  export let clampedHeight: number;

  const layouts = [ Normal, Card, Simple, Full ];

  $: song = $playingSongId ? $songsMap[$playingSongId] : undefined;
  $: album = song?.album ? $albumsMap[song?.album] : undefined;

  $: favoritesPlaylist = $playlists.find((playlist) => playlist.id === hash64("Favorites"));
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

  onMount(() => {
    if (album && topBackgroundColor === "var(--m3-scheme-surface-container-low)") {
      album.setBackgroundFromImage().then(() => {
        topBackgroundColor = album?.backgroundColor ? album.backgroundColor : "var(--m3-scheme-surface-container-low)";
      });
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