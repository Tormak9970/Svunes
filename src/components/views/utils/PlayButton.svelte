<script lang="ts">
  import { isPaused, nowPlayingList } from "../../../stores/State";
  import Icon from "../../utils/Icon.svelte";
  import Button from "../../interactables/Button.svelte";
  import Play from "@ktibow/iconset-material-symbols/play-arrow-rounded";
  import Pause from "@ktibow/iconset-material-symbols/pause-rounded";

  export let name: string | undefined;
  export let type: "filled" | "text" = "filled";

  $: console.log(name);
  $: console.log($nowPlayingList);
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