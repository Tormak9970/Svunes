<script lang="ts">
    import { CardClickable } from "@layout";
    import { connectedDevices, selectedDevice } from "@stores/State";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="speaker-options">
  {#each $connectedDevices as device}
    <CardClickable
      type="transparent"
      highlight={$selectedDevice === device}
      holdable={false}
      on:click={() => $selectedDevice = device}
      extraOptions={{ style: "width: 100%; border-radius: 6px; padding: 0.75rem 0.5rem;" }}
    >
      <div class="content" class:highlight={$selectedDevice === device}>{device}</div>
    </CardClickable>
  {/each}
</div>

<style>
  .speaker-options {
    height: fit-content;
    width: 300px;

    background-color: rgb(var(--m3-scheme-surface-container-lowest));
    padding: 0.5rem;

    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;

    pointer-events: all;
  }

  .content {
    width: 100%; 
    display: flex;
    align-items: center;
  }

  .highlight {
    color: rgb(var(--m3-scheme-primary));
  }
</style>