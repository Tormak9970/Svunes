<script lang="ts">
  import type { Artist } from "../../../lib/models/Artist";
  import { albumsMap } from "../../../stores/State";
  import SimilarAlbum from "./SimilarAlbum.svelte";


  export let artist: Artist;
  export let currentAlbumName: string;

  $: albums = Array.from(artist.albumNames).filter((name) => name !== currentAlbumName).map((name) => $albumsMap[name]);
</script>

<div class="similar-albums">
  {#each albums as album}
    <SimilarAlbum album={album} />
  {/each}
</div>

<style>
  .similar-albums {
    width: 100%;

    display: flex;
    align-items: center;

    overflow-y: hidden;
    overflow-x: scroll;

    scrollbar-color: transparent transparent;
  }
</style>