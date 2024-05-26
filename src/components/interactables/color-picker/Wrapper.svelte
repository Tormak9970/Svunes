<script lang="ts">
  import { onMount } from "svelte";

	/** DOM element of the wrapper element */
	export let wrapper: any;

	/** indicator of the popup state */
	export let isOpen: boolean;

	/** if set to true, the wrapper should have a dialog role and be absolute. It should be relative otherwise */
	export let isDialog: boolean;

  onMount(() => {
    wrapper.anchorElement = wrapper.parentElement?.childNodes[0];
  });
</script>

<md-menu bind:this={wrapper} open={isOpen} positioning="popover" role={isDialog ? 'dialog' : ''} style="--md-menu-container-color: rgb(var(--m3-scheme-surface-container)); --md-menu-item-container-color: rgb(var(--m3-scheme-surface-container)); --md-menu-item-selected-container-color: rgb(var(--m3-scheme-secondary-container));">
  <div class="wrapper" style="padding: 0px 8px;">
    <slot />
  </div>
</md-menu>