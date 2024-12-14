<script lang="ts">
  import { isScrolled } from "@directives";
  import { sharedAxisTransition } from "@utils";

  let highlight = false;
</script>

<div class="full-screen-overlay" transition:sharedAxisTransition={{ direction: "Z", leaving: false }}>
  <div class="header">
    <slot name="header" highlight={highlight} />
  </div>
  <div class="content styled-scrollbar" use:isScrolled={{ callback: (isScrolled) => highlight = isScrolled }}>
    <slot name="content" />
  </div>
</div>

<style>
  .full-screen-overlay {
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;

    background-color: rgb(var(--m3-scheme-background));

    z-index: 2;
  }

  .header {
    display: flex;
  }

  .header :global(span) {
    height: 50px;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    overflow-y: scroll;
    overflow-x: hidden;
  }

  .content :global(span) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-bottom: 70px;
  }

  .content::before {
		background: linear-gradient(
			to top,
			rgb(var(--m3-scheme-background) / 0.8),
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