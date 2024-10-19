<script lang="ts">
  import { Lazy, MusicNotePlaceholder } from "@layout";

  export let src: string;
  export let width: number;
  export let height: number;
  export let iconSize: number | undefined = undefined;
  export let borderRadius = "10px";
  export let marginLeft = "0px";
</script>

<div style="width: {width}px; height: {height}px; overflow: hidden; border-radius: {borderRadius}; margin-left: {marginLeft};">
  {#if src !== ""}
    <Lazy height={height} src="{src}">
      <MusicNotePlaceholder width={iconSize} height={iconSize} />
    </Lazy>
  {:else}
    <MusicNotePlaceholder width={iconSize} height={iconSize} />
  {/if}
</div>