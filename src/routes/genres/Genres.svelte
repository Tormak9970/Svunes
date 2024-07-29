<script lang="ts">
  import { Icon, ViewContainer } from "@component-utils";
  import { isScrolled } from "@directives";
  import Button from "@interactables/Button.svelte";
  import Search from "@ktibow/iconset-material-symbols/search";
  import SadFace from "@ktibow/iconset-material-symbols/sentiment-dissatisfied-outline-rounded";
  import Settings from "@ktibow/iconset-material-symbols/settings";
  import ViewHeader from "@layout/ViewHeader.svelte";
  import { t } from "@stores/Locale";
  import { selectedChips } from "@stores/Search";
  import { genres, lastView, selectedView } from "@stores/State";
  import { View } from "@types";
  import GenreEntry from "@views/genres/GenreEntry.svelte";
  import { push } from "svelte-spa-router";
  
  let highlight = false;
  
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
</script>

<ViewContainer>
  <div slot="header">
    <ViewHeader title={$t("GENRES_TITLE")} highlight={highlight}>
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
  <div slot="content" class="content styled-scrollbar" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
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

    overflow: scroll;

    display: grid;
    
    grid-template-columns: repeat(auto-fill, 190px);

    grid-auto-flow: row;
    grid-auto-rows: 100px;

    justify-content: center;
    
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