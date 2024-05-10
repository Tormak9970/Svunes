<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import ViewNav from "./components/navigation/mobile/ViewNav.svelte";
  import MiniPlayer from "./components/MiniPlayer.svelte";
  import Titlebar from "./components/Titlebar.svelte";
  import "./lib/external/md3-index";
  import { showMiniPlayer, showViewNav } from "./stores/State";
  import Overlays from "./components/overlays/Overlays.svelte";
  import { AppController } from "./lib/controllers/AppController";

  let isDesktop = false;

  onMount(() => {
    AppController.init();
  });

  onDestroy(() => {
    AppController.destroy();
  });
</script>

<main>
  <Overlays />
  {#if $showViewNav}
    <ViewNav />
  {/if}
  {#if $showMiniPlayer}
    <MiniPlayer />
  {/if}
  <div class="content">
    Hello World
  </div>
  {#if isDesktop}
    <Titlebar title="Tunistic" />
  {/if}
</main>

<style>
  main {
    height: 100%;
    width: 100%;

    background-color: var(--md-sys-color-background);
    color: var(--md-sys-color-on-background);

    display: flex;
    align-items: center;
    flex-direction: column-reverse;
  }

  .content {
    flex-grow: 1;
  }
</style>
