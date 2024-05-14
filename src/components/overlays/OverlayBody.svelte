<script lang="ts">
  import type { MdDialog } from "@material/web/all";
    import { onMount } from "svelte";

  let self: MdDialog;

  export let show: boolean;
  export let showDivider = true;

  export function close() {
    self.close();
  }

  onMount(() => {
    const style = document.createElement( 'style' )
    style.innerHTML = '.scroller { scrollbar-color: transparent transparent; transition: scrollbar-color 0.2s ease-in-out; } .scroller:hover { scrollbar-color: var(--md-sys-color-primary) transparent; }';
    self.shadowRoot?.appendChild(style);
  });
</script>

<!-- ? Docs: https://material-web.dev/components/dialog/ -->

<div class="wrapper" style="--md-dialog-headline-color: var();">
  <md-dialog open={show} bind:this={self} style="min-width: min(560px, 100% - 48px);">
    <div class="headline" slot="headline" style="padding: 24px 0px 0px; flex-direction: column;">
      <div class="headline-wrapper" style="width: calc(100% - 48px); padding: 0px 24px;">
        <slot name="header" />
      </div>
      {#if showDivider}
        <md-divider></md-divider>
      {/if}
    </div>
    <div slot="content">
      <slot name="content" />
    </div>
    <div slot="actions" style="padding: 16px 24px 20px 24px;">
      <slot name="actions" />
    </div>
  </md-dialog>
</div>

<style>

</style>