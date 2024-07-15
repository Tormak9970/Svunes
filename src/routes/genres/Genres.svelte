<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import { t } from "@stores/Locale";
  import { genres } from "@stores/State";
  import GenreEntry from "@views/genres/GenreEntry.svelte";
  import GenresHeader from "@views/genres/GenresHeader.svelte";
  import ViewContainer from "@views/utils/ViewContainer.svelte";
  
  let isAtTop = true;

  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    isAtTop = element.scrollTop === 0;
  }
</script>

<ViewContainer>
  <div slot="header">
    <GenresHeader highlight={!isAtTop} />
  </div>
  <div slot="content" class="content" on:scroll={scrollHandler}>
    {#if $genres.length > 0}
      {#each $genres as genre}
        <GenreEntry genre={genre} />
      {/each}
      <div style="width: 100%; padding-bottom: 70px;" />
    {:else}
      <div class="message-container">
        <Icon icon={SadFace} width="60px" height="60px" />
        <div class="message">{$t("NO_TYPE_FOUND_MESSAGE").replace("{type}", $t("GENRE_PLURAL_VALUE"))}.</div>
      </div>
    {/if}
  </div>
</ViewContainer>

<style>
  .content {
    height: 100%;
    width: 100%;

    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    overflow: scroll;
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