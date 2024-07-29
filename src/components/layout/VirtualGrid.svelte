<script lang="ts" context="module">
  type CacheEntry = {
    start: number;
    end: number;
    heightMap: any[];
    itemHeight: number;
    top: number;
    bottom: number;
    listScrollTop: number;
  };
  
  let virtualGridCache: Record<string, CacheEntry> = {};

  function getCacheEntry(name: string, saveState: boolean, itemHeight: number): CacheEntry {
    const cacheEntry = virtualGridCache[name];

    if (!cacheEntry || !saveState || cacheEntry.itemHeight !== itemHeight) {
      virtualGridCache[name] = {
        start: 0,
        end: 0,
        heightMap: [],
        itemHeight: itemHeight,
        top: 0,
        bottom: 0,
        listScrollTop: 0
      }
    }

    return virtualGridCache[name];
  }
</script>

<script lang="ts">
	import { debounce } from "@lib/utils/Utils";
	import { onMount, tick } from "svelte";

	// * Component Props.
  export let name: string;
	export let items: any[];
	export let height = "100%";
  export let width = "100%";
	export let itemHeight: number;
  export let itemWidth: number;
  export let columnGap: number;
  export let rowGap: number;
  export let isScrolled = true;
  export let saveState = true;

  export let keyFunction = (entry: any) => entry.index;

  $: cacheEntry = getCacheEntry(name, saveState, itemHeight);

  // * Local State
  let mounted: boolean;
  let entries: HTMLCollectionOf<HTMLElement>;
  let visible: any[];

  let viewport: HTMLElement;
  let viewportHeight = 0;
  let viewportWidth = 0;

  let contents: HTMLElement;

  let averageHeight: number;

  $: visible = items.slice(cacheEntry.start, cacheEntry.end).map((data, i) => {
    return { index: i + cacheEntry.start, data };
  });

  // * Whenever `items` changes, invalidate the current heightmap.
  $: if (mounted) refresh(items, viewportHeight, itemHeight);

  /**
   * Refreshes the contents of the virtual grid.
   * @param items The items to render.
   * @param viewportHeight The viewport height.
   * @param itemHeight The height of the elements being rendered.
   */
  async function refresh(items: any[], viewportHeight: number, itemHeight: number) {
    if (!viewport) return;
    
    const { scrollTop } = viewport;
    const numEntriesPerRow = Math.floor((viewport.clientWidth + columnGap) / (itemWidth + columnGap));

    // * Wait until the DOM is up to date.
		await tick();

		let contentHeight = cacheEntry.top - scrollTop;
		let i = cacheEntry.start;

		while ((contentHeight - rowGap) < viewportHeight && i < items.length) {
			let entry = entries[i - cacheEntry.start];

			if (!entry) {
				cacheEntry.end = i + 1;
        // * Render the newly visible entry.
				await tick();
				entry = entries[i - cacheEntry.start];
			}

			const entryHeight = cacheEntry.heightMap[i] = (itemHeight + rowGap);
      // * Only increase the contentHeight if this is the last element in the row, or the last element.
      if (i % numEntriesPerRow === numEntriesPerRow - 1 || i === items.length - 1) contentHeight += entryHeight;

			i++;
		}

    contentHeight -= rowGap;

		cacheEntry.end = i;

		const remaining = items.length - cacheEntry.end;
		averageHeight = (cacheEntry.top + contentHeight) / cacheEntry.end;

		cacheEntry.bottom = remaining * averageHeight;
		cacheEntry.heightMap.length = items.length;
    
		virtualGridCache = { ...virtualGridCache }
  }

  /**
   * Handles when the virtual grid is scrolled.
   */
  async function handleScroll() {
    const { scrollTop } = viewport;
    isScrolled = scrollTop !== 0;
    cacheEntry.listScrollTop = scrollTop;

    const numEntriesPerRow = Math.floor((viewport.clientWidth + columnGap) / (itemWidth + columnGap));

		const oldStart = cacheEntry.start;

		for (let v = 0; v < entries.length; v++) {
			cacheEntry.heightMap[cacheEntry.start + v] = (itemHeight + rowGap);
		}

		let i = 0;
		let y = 0;

		while (i < items.length) {
			const entryHeight = cacheEntry.heightMap[i] || averageHeight;

			if (y + entryHeight > scrollTop) {
				cacheEntry.start = i;
				cacheEntry.top = y;

				break;
			}

      // * Only increase the height if this is the last element in the row, or the last element
			if (i % numEntriesPerRow === numEntriesPerRow - 1 || i === items.length - 1) y += entryHeight;
			i++;
		}

		while (i < items.length) {
      // * Only increase the height if this is the last element in the row, or the last element
			if (i % numEntriesPerRow === numEntriesPerRow - 1 || i === items.length - 1) y += cacheEntry.heightMap[i] || averageHeight;
			i++;

      // ? subtract row-gap here to always exclude the last line's row-gap
			if ((y - rowGap) > scrollTop + viewportHeight) break;
		}

		cacheEntry.end = i;

		const remaining = items.length - cacheEntry.end;
		averageHeight = y / cacheEntry.end;

		while (i < items.length) {
      cacheEntry.heightMap[i++] = averageHeight;
    }

		cacheEntry.bottom = remaining * averageHeight;

		// prevent jumping if we scrolled up into unknown territory
		if (cacheEntry.start < oldStart) {
			await tick();

			let expectedHeight = 0;
			let actualHeight = 0;

			for (let i = cacheEntry.start; i < oldStart; i++) {
				if (entries[i - cacheEntry.start] && i % numEntriesPerRow === 0) {
					expectedHeight += cacheEntry.heightMap[i];
					actualHeight += (itemHeight + rowGap);
				}
			}

			const d = actualHeight - expectedHeight;
			viewport.scrollTo(0, scrollTop + d);
		}

		virtualGridCache = { ...virtualGridCache }
  }

  const debouncedRefresh = debounce(() => refresh(items, viewportHeight, itemHeight), 100);

  $: if (mounted && viewportHeight && viewportWidth) debouncedRefresh();

  // * Trigger initial refresh.
  onMount(() => {
    entries = contents.getElementsByTagName("svelte-virtual-grid-entry") as HTMLCollectionOf<HTMLElement>;
    viewport.scrollTo(0, cacheEntry.listScrollTop);
    mounted = true;
  });
</script>

<div style="width: {width}; height: {height};">
  <svelte-virtual-grid-viewport
    style="height: {height}; --img-width: {itemWidth}px; --img-height: {itemHeight}px; --column-gap: {columnGap}px; --row-gap: {rowGap}px;"
    class="styled-scrollbar"
    on:scroll={handleScroll}
    bind:offsetHeight={viewportHeight}
    bind:offsetWidth={viewportWidth}
    bind:this={viewport}
  >
    <svelte-virtual-grid-contents
      style="padding-top: {cacheEntry.top}px; padding-bottom: {cacheEntry.bottom + 60 + 2}px;"
      bind:this={contents}
    >
      {#each visible as entry (keyFunction(entry))}
        <svelte-virtual-grid-entry>
          <slot entry={entry.data}>Missing template</slot>
        </svelte-virtual-grid-entry>
      {/each}
    </svelte-virtual-grid-contents>
  </svelte-virtual-grid-viewport>
</div>

<style>
	svelte-virtual-grid-viewport {
		position: relative;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		display: block;
	}

	svelte-virtual-grid-contents {
		width: 100%;
    display: grid;
    
    grid-template-columns: repeat(auto-fill, var(--img-width));
    
    row-gap: var(--row-gap);
    column-gap: var(--column-gap);

    grid-auto-flow: row;
    grid-auto-rows: var(--img-height);

    justify-content: center;
	}

	svelte-virtual-grid-entry {
		overflow: hidden;
	}
</style>