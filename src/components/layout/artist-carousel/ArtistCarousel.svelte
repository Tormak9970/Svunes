<script lang="ts">
  import { Icon } from "@component-utils";
  import Button from "@interactables/Button.svelte";
  import ArtistCarouselList from "./ArtistCarouselList.svelte";

  import ForwardArrow from "@ktibow/iconset-material-symbols/arrow-forward-rounded";
  import type { Artist } from "@models";
  
  export let maxLength = 5;

  export let label: string;
  export let artists: Artist[];
</script>

<div class="carousel-container">
  <div class="carousel-header">
    <h3 class="label">{label}</h3>
    <Button type="text" iconType="full" on:click>
      <Icon icon={ForwardArrow} width="20px" height="20px" />
    </Button>
  </div>
  <ArtistCarouselList artists={artists.length > maxLength ? artists.slice(0, maxLength) : artists} />
</div>

<style>
  .carousel-container {
    width: 100%;
  }

  .carousel-header {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 20px);
    margin-left: 15px;
  }

  .carousel-header .label {
    font-weight: bold;
    margin: 0px;
  }
</style>