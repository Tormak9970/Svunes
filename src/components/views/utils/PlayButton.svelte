<script lang="ts">
  import Icon from "@component-utils/Icon.svelte";
  import Button from "@interactables/Button.svelte";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import { isPaused, nowPlayingList } from "@stores/State";

  export let name: string | undefined;
  export let type: "filled" | "text" = "filled";
</script>

<div class="play-container">
  <Button type={type} iconType="full" on:click>
    {#if $nowPlayingList === name && !$isPaused}
      <Icon icon={Pause} />
    {:else}
      <Icon icon={Play} />
    {/if}
  </Button>
</div>