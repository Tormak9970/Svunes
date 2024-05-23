<script>
	import ColorPicker from 'svelte-awesome-color-picker';

  let hex = "#dcb9f8";
</script>

<div class="wrapper">
  <ColorPicker
    label=""
    bind:hex={hex}
    isAlpha={false}
  />
</div>

<style>
  .wrapper :global([role='dialog']) {
    right: -10px;
    top: 35px;
    left: initial;

    --cp-bg-color: rgb(var(--m3-scheme-surface-container));
		--cp-border-color: transparent;
		--cp-text-color: rgb(var(--m3-scheme-on-background));
		--cp-input-color: rgb(var(--m3-scheme-background));
		--cp-button-hover-color: rgb(var(--m3-scheme-surface-container-lowest));
    --slider-width: 15px;
    --input-size: 32px;
    --focus-color: rgb(var(--m3-scheme-primary));

    ---thumb-border: 1px solid transparent;
  }
</style>