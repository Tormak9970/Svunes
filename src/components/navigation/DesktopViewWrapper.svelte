<script lang="ts">
  import { fly } from "svelte/transition";
  import Toggle from "../interactables/Toggle.svelte";
  import DesktopNav from "./DesktopNav.svelte";

  let showingSidePanel = true; // ! this'll need to be a store
</script>

<!-- svelte-ignore missing-declaration -->
{#if !IS_MOBILE}
  <div class="panels-container">
    <div class="nav-panel">
      <DesktopNav />
      <label>
        <Toggle bind:checked={showingSidePanel} />
      </label>
    </div>
    <div class="view-panel" style:width={showingSidePanel ? "calc(100% - 10rem - 1rem - 20rem)" : "calc(100% - 10rem - 0.5rem)"}>
      <slot />
    </div>
    {#if showingSidePanel}
      <div class="details-panel" transition:fly={{ duration: 0.2, x: 200 }}>
        text
      </div>
    {/if}
  </div>
{:else}
  <slot />
{/if}

<style>
  .panels-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: calc(100% - 1rem);
    width: calc(100% - 1rem);
    padding: 0.5rem;
  }

  .nav-panel {
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    width: 10rem;
  }

  .view-panel {
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    flex-grow: 1;

    position: relative;

    background-color: rgb(var(--m3-scheme-surface-container-low));

    /* transition: width 0.2s ease-in-out; */
  }

  .details-panel {
    height: 100%;
    width: 20rem;
    border-radius: 10px;
    overflow: hidden;

    background-color: rgb(var(--m3-scheme-surface-container-low));
  }
</style>