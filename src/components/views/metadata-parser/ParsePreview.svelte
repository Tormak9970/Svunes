<script lang="ts">
  import TabsHeader, { type TabItem } from "@layout/TabsHeader.svelte";
  import t from "@lib/utils/i18n";
  import { showInfoSnackbar } from "../../../stores/State";
  import type { ParseResult } from "../../../types/MetadataParser";
  import ParseEntry from "./ParseEntry.svelte";

  export let results: ParseResult[];
  export let tab: string;
  export let tabsUsed: TabItem[];

  $: numFailed = results.filter((result) => Object.keys(result).length === 2).length;

  let isOverflowingTop = false;
  
  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    isOverflowingTop = element.scrollTop !== 0;
  }

  function notifyUserOfErrors() {
    $showInfoSnackbar({ message: `${numFailed} ${t("ENTRIES_DONT_MATCH_PATTERN_MESSAGE")}` });
  }
</script>

<div class="tabs-container">
  <TabsHeader secondary items={tabsUsed} bind:tab={tab} />
  <div class="shadow-positioner">
    {#if numFailed !== 0}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="status-badge" on:click={notifyUserOfErrors}>
        <div class="amount">{numFailed}</div>
      </div>
    {/if}
    <div class="tabs" class:overflow-top={isOverflowingTop} on:scroll={scrollHandler}>
      {#key tab}
        <div class="tab">
          {#each results as result (result.songId)}
            <ParseEntry result={result} tab={tab} />
          {/each}
        </div>
      {/key}
    </div>
  </div>
</div>

<style>
  .tabs-container {
    width: 100%;
    height: 100%;
  }

  .shadow-positioner {
    width: 100%;
    height: calc(100% - 3rem);
    position: relative;
  }

  .tabs {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .status-badge {
    position: absolute;
    top: 0.5rem;
    right: 0;
    background-color: rgb(var(--m3-scheme-error));
    border-radius: 50%;

    height: 25px;
    width: 25px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    transition: background-color 200ms;
  }
  .status-badge:hover {
    background-color: rgb(var(--m3-scheme-error) / 0.9);
  }

  .amount {
    font-size: 14px;
    color: rgb(var(--m3-scheme-on-error));
  }

  .overflow-top::before {
		background: linear-gradient(
			to bottom,
			rgb(var(--m3-scheme-background) / 0.8),
			transparent
		);
		content: "";
		width: 100%;
		position: absolute;
		height: 40px;
		z-index: 2;
    top: 0;

    pointer-events: none;
	}

  .tab {
    width: fit-content;
    min-width: calc(100% - 1rem);

    padding: 0.5rem 0;

    display: flex;
    flex-direction: column;

    gap: 0.75rem;

    height: fit-content;

    padding-bottom: 70px;
  }
</style>