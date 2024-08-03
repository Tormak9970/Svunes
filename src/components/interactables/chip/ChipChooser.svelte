<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  import Chip from "./Chip.svelte";
  export let options: { label: string; value: string; icon?: IconifyIcon }[];
  export let chosenOptions: string[] = [];
  export let type: "input" | "assist" | "general";
</script>

<div class="m3-container">
  {#each options as option}
    <Chip
      type={type}
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
    width: fit-content;
    gap: 0.5rem;
  }
</style>