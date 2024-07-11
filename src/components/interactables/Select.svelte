<script lang="ts">
    
  export let label: string;
  export let value: string;
  export let disabled: boolean = false;

  function onInput(e: any) {
    value = (e.target as HTMLInputElement).value;
  }
</script>

<div
  style:--md-menu-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-container-color="rgb(var(--m3-scheme-surface-container))"
  style:--md-menu-item-selected-container-color="rgb(var(--m3-scheme-secondary-container))"

  style:--md-outlined-select-text-field-outline-color="rgb(var(--m3-scheme-outline))"
  style:--md-outlined-select-text-field-trailing-icon-color="rgb(var(--m3-scheme-outline))"
  style:--md-outlined-select-text-field-label-text-color="rgb(var(--m3-scheme-outline))"
  style:--md-outlined-select-text-field-container-shape="var(--m3-util-rounding-extra-small)"
  style:--md-outlined-select-text-field-input-text-color="rgb(var(--m3-scheme-on-surface))"
  style:--md-outlined-select-text-field-input-text-font="var(--m3-font)"

  
  style:--md-outlined-select-text-field-hover-outline-color="rgb(var(--m3-scheme-on-surface))"
  style:--md-outlined-select-text-field-hover-trailing-icon-color="rgb(var(--m3-scheme-on-surface))"
  style:--md-outlined-select-text-field-hover-label-text-color="rgb(var(--m3-scheme-on-surface))"
  style:--md-outlined-select-text-field-hover-input-text-color="rgb(var(--m3-scheme-on-surface))"

  style:--md-outlined-select-text-field-focus-outline-color="rgb(var(--m3-scheme-primary))"
  style:--md-outlined-select-text-field-focus-trailing-icon-color="rgb(var(--m3-scheme-primary))"
  style:--md-outlined-select-text-field-focus-label-text-color="rgb(var(--m3-scheme-primary))"
  style:--md-outlined-select-text-field-focus-input-text-color="rgb(var(--m3-scheme-on-surface))"

  style:--md-menu-item-label-text-color="rgb(var(--m3-scheme-on-surface))"
  style:--md-menu-item-selected-label-text-color="rgb(var(--m3-scheme-on-surface))"
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <md-outlined-select label={label} value={value} disabled={disabled} on:input={onInput} on:input on:change on:click>
    <slot />
  </md-outlined-select>
</div>