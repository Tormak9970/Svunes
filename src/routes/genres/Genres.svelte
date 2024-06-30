<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import { genres } from "@stores/State";
  import GenreEntry from "@views/genres/GenreEntry.svelte";
  import GenresHeader from "@views/genres/GenresHeader.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
</script>

<ViewContainer>
  <div slot="header">
    <GenresHeader highlight={false} />
  </div>
  <div slot="content" class="content">
    {#if $genres.length > 0}
      {#each $genres as genre}
        <GenreEntry genre={genre} />
      {/each}
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="message">No genres found. Try adding music folders in settings</div>
      </div>
    {/if}
  </div>
</ViewContainer>

<style>
  .content {
    height: 100%;
    width: 100%;
    margin-top: 2px;

    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    gap: 2px;
  }

  .message-container {
    width: 100%;
    margin-top: 40%;
    color: rgb(var(--m3-scheme-on-secondary));
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message {
    max-width: 300px;
    font-size: 18px;
    text-align: center;
  }
</style>