<script lang="ts">
  import { Icon } from "@component-utils";
  import { BackArrow, Close } from "@icons";
  import { Button } from "@interactables";
  import { isLandscape } from "@stores/Layout";
  import { backFromSidePanel } from "@utils";

  export let back: () => void;
</script>

{#if $isLandscape}
  <Button type="text" iconType="full" on:click={backFromSidePanel}>
    <Icon icon={Close} width="20px" height="20px" />
  </Button>
{:else}
  <Button type="text" iconType="full" on:click={back}>
    <Icon icon={BackArrow} width="20px" height="20px" />
  </Button>
{/if}