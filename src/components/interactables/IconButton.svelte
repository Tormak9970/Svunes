<script lang="ts">
  export let selected = false;
  export let onClick = () => {};

  export let width = "30px";
  export let height = "30px";
  export let iconSize = "22px";
  export let selectedColor = "--md-sys-color-outline-variant";

  function onClickWrapper() {
    selected = true;
    onClick()
  }
</script>

<!-- ? Docs: https://material-web.dev/components/icon-button/#filled-icon-button-tokens -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="--md-filled-tonal-icon-button-container-width: {width}; --md-filled-tonal-icon-button-container-height: {height}; --md-filled-tonal-icon-button-icon-size: {iconSize}; --md-filled-tonal-icon-button-container-color: var({selected ? selectedColor : "--md-sys-color-surface-container"});">
  <md-filled-tonal-icon-button selected={selected} on:click={onClickWrapper}>
    <div style="width: {iconSize}; height: {iconSize};">
      <slot />
    </div>
  </md-filled-tonal-icon-button>
</div>