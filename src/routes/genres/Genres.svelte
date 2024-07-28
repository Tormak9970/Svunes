<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import ViewContainer from "@component-utils/ViewContainer.svelte";
  import Button from "@interactables/Button.svelte";
  import Search from "@ktibow/iconset-material-symbols/search";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import ViewHeader from "@layout/ViewHeader.svelte";
  import { t } from "@stores/Locale";
  import { selectedChips } from "@stores/Search";
  import { genres, lastView, selectedView } from "@stores/State";
  import GenreEntry from "@views/genres/GenreEntry.svelte";
  import { push } from "svelte-spa-router";
  import { View } from "../../types/View";
  
  let isAtTop = true;
  
  /**
   * Navigates to the settings view.
   */
  function goToSettings() {
    $lastView = $selectedView;
    $selectedView = View.SETTINGS;
    push("/settings");
  }

  /**
   * Navigates to the search view.
   */
  function openSearch() {
    $lastView = $selectedView;
    $selectedView = View.SEARCH;
    $selectedChips = [ "genre" ];
    push("/search");
  }

  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    isAtTop = element.scrollTop === 0;
  }
</script>

<ViewContainer>
  <div slot="header">
    <ViewHeader title={$t("GENRES_TITLE")} highlight={!isAtTop}>
      <div slot="left">
        <Button type="text" iconType="full" on:click={openSearch}>
          <Icon icon={Search} width="20px" height="20px" />
        </Button>
      </div>
      <div slot="right">
        <Button type="text" iconType="full" on:click={goToSettings}>
          <Icon icon={Settings} width="20px" height="20px" />
        </Button>
      </div>
    </ViewHeader>
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