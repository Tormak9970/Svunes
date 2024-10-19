<script lang="ts">
  import { Icon } from "@component-utils";
  import { Pause, Play } from "@icons";
  import { isPaused, nowPlayingList } from "@stores/State";
  import Button from "./Button.svelte";

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