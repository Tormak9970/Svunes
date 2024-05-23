<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Chip from "./Chip.svelte";
  export let options: { label: string; value: string; icon?: IconifyIcon }[];
  export let chosenOptions: string[] = [];
</script>

<div class="m3-container">
  {#each options as option}
    <Chip
      {...option}
      type="input"
      selected={chosenOptions.includes(option.value)}
      on:click={() =>
        chosenOptions.includes(option.value)
          ? (chosenOptions = chosenOptions.filter((o) => o != option.value))
          : (chosenOptions = [...chosenOptions, option.value])}
    >
      {option.label}
    </Chip>
  {/each}
</div>

<style>
  .m3-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>