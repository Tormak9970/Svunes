<script lang="ts">
	export let hex: string;
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="container" on:click>
  <div class="color" style:background={hex} />
</div>

<style>
	.container {
		position: relative;
		display: block;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30px;

    cursor: pointer;
	}

	.color {
		position: absolute;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		user-select: none;
	}
</style>