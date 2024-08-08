<script lang="ts">
	import { scrollShadow } from "@directives";
	import { isLandscape } from "@stores/Layout";
	import { onMount, tick } from "svelte";

	// * Component Props.
	export let items: any[];
	export let height = "100%";
  export let width = "100%";
	export let itemHeight: any = undefined;
  export let isScrolled = false;
  
  export let keyFunction = (entry: any) => entry.index;

  let start = 0;
  let end = 0;
  let heightMap: number[] = [];

  let top = 0;
  let bottom = 0;
  let listScrollTop = 0;

  // * Local State
	let mounted: boolean;
	let rows: HTMLCollectionOf<HTMLElement>;
	let visible: any[];

	let viewport: HTMLElement;
	let viewportHeight = 0;

	let contents: HTMLElement;

	let averageHeight: number;

	$: visible = items.slice(start, end).map((data, i) => {
		return { index: i + start, data };
	});

  // * Whenever `items` changes, invalidate the current heightmap.
	$: if (mounted) refresh(items, viewportHeight, itemHeight);

  /**
   * Refreshes the contents of the virtual list.
   * @param items The items to render.
   * @param viewportHeight The viewport height.
   * @param itemHeight The height of the elements being rendered.
   */
	async function refresh(items: any[], viewportHeight: number, itemHeight: number) {
    if (!viewport) return;
    
		const { scrollTop } = viewport;

    // * Wait until the DOM is up to date.
		await tick();

		let contentHeight = top - scrollTop;
		let i = start;

		while (contentHeight < viewportHeight && i < items.length) {
			let row = rows[i - start];

			if (!row) {
				end = i + 1;
        // * Render the newly visible entry.
				await tick();
				row = rows[i - start];
			}

			const rowHeight = heightMap[i] = itemHeight || row.offsetHeight;
			contentHeight += rowHeight;
			i++;
		}

		end = i;

		const remaining = items.length - end;
		averageHeight = (top + contentHeight) / end;

		bottom = remaining * averageHeight;
		heightMap.length = items.length;
	}

  /**
   * Handles when the virtual list is scrolled.
   */
	async function handleScroll() {
		const { scrollTop } = viewport;
    listScrollTop = scrollTop;
    isScrolled = scrollTop !== 0;

		const oldStart = start;

		for (let v = 0; v < rows.length; v += 1) {
			heightMap[start + v] = itemHeight || rows[v].offsetHeight;
		}

		let i = 0;
		let y = 0;

		while (i < items.length) {
			const rowHeight = heightMap[i] || averageHeight;

			if (y + rowHeight > scrollTop) {
				start = i;
				top = y;

				break;
			}

			y += rowHeight;
			i++;
		}

		while (i < items.length) {
			y += heightMap[i] || averageHeight;
			i++;

			if (y > scrollTop + viewportHeight) break;
		}

		end = i;

		const remaining = items.length - end;
		averageHeight = y / end;

		while (i < items.length) {
      heightMap[i++] = averageHeight;
    }

		bottom = remaining * averageHeight;

		// * Prevent jumping if we scrolled up into unknown territory.
		if (start < oldStart) {
			await tick();

			let expectedHeight = 0;
			let actualHeight = 0;

			for (let i = start; i < oldStart; i +=1) {
				if (rows[i - start]) {
					expectedHeight += heightMap[i];
					actualHeight += itemHeight || rows[i - start].offsetHeight;
				}
			}

			const d = actualHeight - expectedHeight;
			viewport.scrollTo(0, scrollTop + d);
		}
	}

	// * Trigger initial refresh.
	onMount(() => {
		rows = contents.getElementsByTagName("svelte-virtual-list-row") as HTMLCollectionOf<HTMLElement>;
		mounted = true;
	});
</script>

<div style="width: {width}; height: {height};">
  <svelte-virtual-list-viewport
    style="height: {height};"
    class="styled-scrollbar"
    use:scrollShadow={{ enabled: $isLandscape, background: "--m3-scheme-surface-container" }}
    on:scroll={handleScroll}
    bind:offsetHeight={viewportHeight}
    bind:this={viewport}
  >
    <svelte-virtual-list-contents
      style="padding-top: {top}px; padding-bottom: {bottom + 60 + 2}px;"
      bind:this={contents}
    >
      {#each visible as row (keyFunction(row))}
        <svelte-virtual-list-row>
          <slot entry={row.data}>Missing template</slot>
        </svelte-virtual-list-row>
      {/each}
    </svelte-virtual-list-contents>
  </svelte-virtual-list-viewport>
</div>

<style>
	svelte-virtual-list-viewport {
		position: relative;
		overflow-y: auto;
    overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
		display: block;
	}

	svelte-virtual-list-contents {
		display: block;
	}

	svelte-virtual-list-row {
    margin-left: 10px;
    margin-right: 10px;
		display: flex;
		overflow: hidden;
	}
</style>