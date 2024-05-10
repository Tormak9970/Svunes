<script lang="ts">
  export let selected = false;
  export let onClick = () => {};

  export let width = "30px";
  export let height = "30px";
  export let iconSize = "22px";
  export let selectedColor = "var(--md-sys-color-outline-variant)";

  function onClickWrapper() {
    selected = true;
    onClick()
  }
</script>

<!-- ? Docs: https://material-web.dev/components/icon-button/#filled-icon-button-tokens -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper" style="--md-filled-tonal-icon-button-container-width: {width}; --md-filled-tonal-icon-button-container-height: {height}; --md-filled-tonal-icon-button-icon-size: {iconSize}; --icon-size: {iconSize}; --md-filled-tonal-icon-button-container-color: {selected ? selectedColor : "var(--md-sys-color-surface-container)"};">
  <md-filled-tonal-icon-button selected={selected} on:click={onClickWrapper}>
    <div class="icon">
      <slot />
    </div>
  </md-filled-tonal-icon-button>
</div>

<style>
  .icon {
    width: var(--icon-size);
    height: var(--icon-size);
  }
</style>