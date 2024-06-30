<script lang="ts">
  import type { Song } from "@lib/models/Song";
  import SongEntry from "./SongEntry.svelte";

  export let songs: Song[];
</script>

<div class="song-entries">
  {#each songs as song, i (`${song.title}${i}${song.trackNumber}${song.length}`)}
    <SongEntry song={song} />
  {/each}
</div>

<style>
  .song-entries {
    width: calc(100% - 10px);
    margin: 0px 5px;
  }
</style>