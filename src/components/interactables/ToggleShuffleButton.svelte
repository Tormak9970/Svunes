<script lang="ts">
  import { Icon } from "@component-utils";
  import { Shuffle } from "@icons";
  import { fade } from "svelte/transition";
  import Button from "./Button.svelte";

  export let shuffle: boolean;
</script>

<div class="shuffle-container">
  <Button type="text" iconType="full" extraOptions={{ style: "display: flex;" }} on:click={() => shuffle = !shuffle }>
    <div class="wrapper" style:color={shuffle ? "rgb(var(--m3-scheme-primary))" : "rgb(var(--m3-scheme-outline-variant))"}>
      <Icon icon={Shuffle} />
    </div>
  </Button>
  {#if shuffle}
    <div class="indicator" in:fade={{ duration: 200 }} />
  {/if}
</div>

<style>
  .shuffle-container {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
  }

  .wrapper {
    width: 40px;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .indicator {
    position: absolute;

    bottom: 2px;

    width: 4px;
    height: 4px;
    border-radius: 2px;

    background-color: rgb(var(--m3-scheme-primary));
  }
</style>