<script lang="ts">
  import { onMount } from "svelte";

	export let style = "";

	export let direction = "left";

	export let speed = 100;

	let className = "";
	export { className as class };

	export let gap = 0;

  export let gradientColor = "var(--m3-scheme-background)";

  let container: HTMLDivElement;
	let containerWidth: number;
	let marqueeWidth: number;

	$: duration =
		marqueeWidth < containerWidth
			? containerWidth / speed
			: marqueeWidth / speed;

  let isGreater = false;

  onMount(() => {
    isGreater = (container.scrollWidth / 2 - gap) > containerWidth;
  });
</script>

<div
	style={style}
	class="marquee-container {className}"
	bind:clientWidth={containerWidth}
  bind:this={container}
	style:--gap={gap + "px"}
	style:--play={(isGreater) ? "running" : "paused"}
	style:--direction={direction === "left" ? "normal" : "reverse"}
	style:--duration={duration + "s"}
  style:--gradient-color={gradientColor}
>
  {#if isGreater}
    <div class="gradient" data-testid="marquee-gradient" />
  {/if}
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

	.marquee-container:hover .marquee {
		animation-play-state: paused;
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
		100% {
			transform: translateX(-100%);
		}
	}

	.initial-child-container {
		flex: 0 0 auto;
		display: flex;
		min-width: auto;
		flex-direction: row;
	}

	.gradient::after,
	.gradient::before {
		background: linear-gradient(
			to right,
			rgb(var(--gradient-color) / 0.6),
			transparent
		);
		content: "";
		height: 100%;
		position: absolute;
		width: var(--gradientWidth, 10%);
		z-index: 2;
	}

	.gradient::before {
		left: 0;
		top: 0;
	}

	.gradient::after {
		right: 0;
		top: 0;
		transform: rotateZ(180deg);
	}
</style>