<script lang="ts">
  import { Icon } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import { showCarMode, showSleepTimerSelection } from "@stores/Overlays";
  import { extraControl } from "@stores/State";

  import Bedtime from "@ktibow/iconset-material-symbols/bedtime-outline-rounded";
  import DirectionsCar from "@ktibow/iconset-material-symbols/directions-car-outline-rounded";

  export let size = "2.5rem";
  export let iconSize = "1.5rem";
</script>

{#if $extraControl === "Car Mode"}
  <Button type="text" iconType="full" size={size} iconSize={iconSize} on:click={() => $showCarMode = true}>
    <Icon icon={DirectionsCar} />
  </Button>
{:else if $extraControl === "Sleep Timer"}
  <Button type="text" iconType="full" size={size} iconSize={iconSize} on:click={() => $showSleepTimerSelection = true}>
    <Icon icon={Bedtime} />
  </Button>
{:else}
  <div />
{/if}