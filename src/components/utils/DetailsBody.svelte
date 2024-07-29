<script lang="ts">
  import { isLandscape } from "@stores/Layout";
  import { sharedAxisTransition } from "@utils";
</script>

<div
  class="full-screen-overlay"
  style:--background-color={!$isLandscape ? "var(--m3-scheme-background)" : "var(--m3-scheme-surface-container)"}
  transition:sharedAxisTransition|global={{ direction: "Z", leaving: false }}
>
  <div class="headline">
    <slot name="header" />
  </div>
  <div class="content styled-scrollbar">
    <slot name="content" />
  </div>
</div>

<style>
  .full-screen-overlay {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;

    background-color: rgb(var(--background-color));

    z-index: 2;
  }

  .content {
    margin-top: 50px;
    height: calc(100% - 50px);
    overflow: hidden;
  }

  .content::before {
		background: linear-gradient(
			to top,
			rgb(var(--background-color) / 0.8),
			transparent
		);
		content: "";
		width: 100%;
		position: absolute;
		height: 40px;
		z-index: 2;
    bottom: 0;

    pointer-events: none;
	}
</style>