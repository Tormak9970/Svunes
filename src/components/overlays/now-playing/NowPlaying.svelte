<script lang="ts">
  import { nowPlayingTheme } from "../../../stores/State";
  import Card from "./themes/Card.svelte";
  import Circle from "./themes/Circle.svelte";
  import Full from "./themes/Full.svelte";
  import Normal from "./themes/Normal.svelte";
  import Simple from "./themes/Simple.svelte";

  export let clampedHeight: number;

  const layouts = [ Normal, Card, Simple, Full, Circle ];
</script>

<div class="full-screen-overlay" style:opacity={(-1 * clampedHeight) / 20}>
  <svelte:component this={layouts[$nowPlayingTheme]} />
</div>

<style>
  .full-screen-overlay {
    width: 100%;
    height: 100%;

    background-color: rgb(var(--m3-scheme-background));
  }
</style>