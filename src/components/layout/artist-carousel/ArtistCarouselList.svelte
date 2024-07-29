<script lang="ts">
  import type { Artist } from "@models";
  import ArtistEntry from "./ArtistEntry.svelte";

  export let artists: Artist[];
</script>

<div class="artists">
  <div class="entries-wrapper">
    {#each artists as artist}
      <ArtistEntry artist={artist} />
    {/each}
  </div>
</div>

<style>
  .artists {
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