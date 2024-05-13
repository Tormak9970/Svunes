<script lang="ts">
  export let onClick = () => {};

  export let width = "36px";
  export let height = "36px";
  export let iconSize = "22px";
</script>

<!-- ? Docs: https://material-web.dev/components/icon-button/#filled-icon-button-tokens -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<md-icon-button style="--_state-layer-width: {width}; --_state-layer-height: {height}; --md--icon-button-icon-size: {iconSize};" on:click|stopPropagation={onClick}>
  <div style="width: {iconSize}; height: {iconSize};">
    <slot />
  </div>
</md-icon-button>