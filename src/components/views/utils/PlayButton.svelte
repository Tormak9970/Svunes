<script lang="ts">
  import { isPaused, nowPlayingListName } from "../../../stores/State";
  import Icon from "../../utils/Icon.svelte";
  import Button from "../../interactables/Button.svelte";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";

  export let name: string | undefined;
  export let type: "filled" | "text" = "filled";
</script>

<div class="play-container">
  <Button type={type} iconType="full" on:click>
    {#if $nowPlayingListName === name && !$isPaused}
      <Icon icon={Pause} />
    {:else}
      <Icon icon={Play} />
    {/if}
  </Button>
</div>