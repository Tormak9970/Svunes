<script lang="ts">
  import Lazy from "@layout/Lazy.svelte";
  import MusicNotePlaceholder from "@layout/placeholders/MusicNotePlaceholder.svelte";
  import { IMAGE_FADE_OPTIONS } from "@utils";

  export let src: string;
  export let width: number;
  export let height: number;
  export let iconSize: number | undefined = undefined;
  export let borderRadius = "10px";
  export let marginLeft = "0px";
</script>

<div style="width: {width}px; height: {height}px; overflow: hidden; border-radius: {borderRadius}; margin-left: {marginLeft};">
  {#if src !== ""}
    <Lazy height={height} fadeOption={IMAGE_FADE_OPTIONS} let:onError>
      <!-- svelte-ignore a11y-missing-attribute -->
      <img src="{src}" style="width: {width}px; height: {height}px;" draggable="false" on:error={onError} />
      <span slot="placeholder">
        <MusicNotePlaceholder width={iconSize} height={iconSize} />
      </span>
    </Lazy>
  {:else}
    <MusicNotePlaceholder width={iconSize} height={iconSize} />
  {/if}
</div>