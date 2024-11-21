<script lang="ts">
  import { MediaQuery } from "@component-utils";
  import { PopoutReciever } from "@controllers";
  import { onDestroy, onMount } from "svelte";
  import LargeBody from "../../components/popout/LargeBody.svelte";
  import MediumBody from "../../components/popout/MediumBody.svelte";
  import PopoutHeader from "../../components/popout/PopoutHeader.svelte";
  import SmallBody from "../../components/popout/SmallBody.svelte";
  import Theme from "../../components/theme/Theme.svelte";
  import "../../lib/md-defs";

  let useSmall = false;
  let useMedium = false;

  onMount(() => {
    PopoutReciever.init();
  });

  onDestroy(() => {
    PopoutReciever.destroy();
  });
</script>

<MediaQuery query="(max-height: 134px)" bind:matches={useSmall} />
<MediaQuery query="(min-height: 135px) and (max-height: 169px)" bind:matches={useMedium} />
<Theme>
  <div class="popout" class:side-header={useSmall}>
    <PopoutHeader useSideHeader={useSmall} />
    <div class="content">
      {#if useSmall}
        <SmallBody />
      {:else if useMedium}
        <MediumBody />
      {:else}
        <LargeBody />
      {/if}
    </div>
  </div>
</Theme>

<style>
  .popout {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: rgb(24, 24, 24);
  }

  .content {
    width: calc(100% - 1rem);
    height: calc(100% - 32px - 1rem);
  }

  /* ! When the popout player is too short */

  .side-header {
    flex-direction: row;
  }

  .side-header .content {
    width: calc(100% - 30px - 0.5rem);
    height: calc(100% - 1rem);
  }
</style>