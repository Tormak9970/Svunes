<script lang="ts">
  import type { Album } from "@lib/models/Album";
  import AlbumEntry from "./AlbumEntry.svelte";

  export let albums: Album[];
</script>

<div class="albums">
  <div class="entries-wrapper">
    {#each albums as album}
      <AlbumEntry album={album} />
    {/each}
  </div>
</div>

<style>
  .albums {
    width: 100%;

    display: flex;
    align-items: center;

    overflow-x: scroll;
  }

  .entries-wrapper {
    padding: 0px 10px;
    display: flex;
    align-items: center;
  }
</style>