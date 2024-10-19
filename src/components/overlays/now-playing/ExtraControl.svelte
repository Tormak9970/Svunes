<script lang="ts">
  import { Icon } from "@component-utils";
  import { Bedtime, DirectionsCar } from "@icons";
  import { Button } from "@interactables";
  import { showCarMode, showSleepTimerSelection } from "@stores/Overlays";
  import { extraControl } from "@stores/State";

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