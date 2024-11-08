<script lang="ts">
  import { isLandscape } from "@stores/Layout";
  import { goToSongDetails } from "@utils";

  export let songId: string;
</script>

{#if $isLandscape}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="title-nav-link" on:click={() => goToSongDetails(songId)}>
    <slot />
  </div>
{:else}
  <slot />
{/if}

<style>
  .title-nav-link {
    
  }

  .title-nav-link:hover {
    cursor: pointer;
    text-decoration: underline;
  }
</style>