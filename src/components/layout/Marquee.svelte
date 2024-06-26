<script lang="ts">
  import { onMount } from "svelte";

	export let speed = 100;
	export let gap = 0;
  
	let direction = "left";
  let isGreater = false;

  let container: HTMLDivElement;
	let containerWidth: number;
	let marqueeWidth: number;

	$: duration =
		marqueeWidth < containerWidth
			? containerWidth / speed
			: marqueeWidth / speed;

  onMount(() => {
    isGreater = (container.scrollWidth / 2 - gap) > containerWidth;
  });
</script>

<div
	class="marquee-container"
	bind:clientWidth={containerWidth}
  bind:this={container}
	style:--gap={gap + "px"}
	style:--play={(isGreater) ? "running" : "paused"}
	style:--direction={direction === "left" ? "normal" : "reverse"}
	style:--duration={duration + "s"}
  style:mask-image={isGreater ? "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)" : "none"}
>
	<div class="marquee" bind:clientWidth={marqueeWidth} data-testid="marquee-slot">
		<slot />
	</div>
	<div class="marquee" data-testid="marquee-slot">
		<slot />
	</div>
</div>

<style>
	.marquee-container {
		display: flex;
		width: 100%;
		overflow-x: hidden;
		flex-direction: row;
		position: relative;
	}

	.marquee {
		flex: 0 0 auto;
		min-width: 100%;
		z-index: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--gap, 0);
		animation: scroll var(--duration) linear infinite;
		animation-play-state: var(--play);
		animation-direction: var(--direction);
		padding-right: var(--gap, 0);
	}

	@keyframes scroll {
		0% {
			transform: translateX(0%);
		}
		80% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(-100%);
    }
	}
</style>