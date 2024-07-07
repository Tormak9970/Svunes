<script lang="ts">
  import TabsHeader, { type TabItem } from "@layout/TabsHeader.svelte";
  import type { ParseResult } from "../../../types/MetadataParser";
  import ParseEntry from "./ParseEntry.svelte";

  export let results: ParseResult[];
  export let tab: string;
  export let tabsUsed: TabItem[];

  let isOverflowingTop = false;
  
  function scrollHandler(e: Event) {
    const element = e.currentTarget as HTMLDivElement;
    isOverflowingTop = element.scrollTop !== 0;
  }
</script>

<div class="tabs-container">
  <TabsHeader secondary items={tabsUsed} bind:tab={tab} />
  <div class="shadow-positioner">
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