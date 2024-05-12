<script lang="ts">
  import { songs } from "../../../stores/State";
import ViewContainer from "../ViewContainer.svelte";
    import Song from "./Song.svelte";
  import SongsHeader from "./SongsHeader.svelte";
  
  let scrollTop = 0;
</script>

<ViewContainer bind:scrollTop={scrollTop}>
  <div slot="header">
    <SongsHeader highlight={scrollTop !== 0} />
  </div>
  <div slot="content">
    {#each $songs as song}
        <Song song={song} />
      {/each}
  </div>
</ViewContainer>

<style>
  
</style>