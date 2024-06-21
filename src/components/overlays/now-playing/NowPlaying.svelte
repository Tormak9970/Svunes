<script lang="ts">
  export let clampedHeight: number;
</script>

<div class="full-screen-overlay" style:opacity={(-1 * clampedHeight) / 20}>
  <div class="headline">
    temp
  </div>
  <div class="content">
    temp
  </div>
</div>

<style>
  .full-screen-overlay {
    width: 100%;
    height: 100%;

    background-color: rgb(var(--m3-scheme-background));
  }

  .content {
    margin-top: 50px;
    height: calc(100vh - 50px);

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 70px;

    overflow-y: scroll;
    
    scrollbar-color: transparent transparent;

    transition: scrollbar-color 0.2s ease-in-out;
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

  .content:hover {
    scrollbar-color: rgb(var(--m3-scheme-primary)) transparent;
  }
</style>