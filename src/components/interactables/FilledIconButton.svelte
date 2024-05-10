<script lang="ts">
  export let onClick = () => {};

  export let width = "30px";
  export let height = "30px";
  export let iconSize = "22px";
  export let fillColor = "--md-sys-color-primary";
  export let iconColor = "--md-sys-color-on-primary"
</script>

<div style="--md-filled-icon-button-container-width: {width}; --md-filled-icon-button-container-height: {height}; --md-filled-icon-button-container-color: var({fillColor}); --md-filled-icon-button-icon-color: var({iconColor});">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <md-filled-icon-button on:click={onClick}>
    <div style="width: {iconSize}; height: {iconSize}; font-size: {iconSize};">
      <slot />
    </div>
  </md-filled-icon-button>
</div>