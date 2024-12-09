<script lang="ts">
  import { Icon } from "@component-utils";
  import type { IconifyIcon } from "@iconify/types";
  import { Card } from "@layout";

  import BandsLabel from "./equalizer/BandsLabel.svelte";
  import BandSpacer from "./equalizer/BandSpacer.svelte";
  import EqualizerBand from "./equalizer/EqualizerBand.svelte";

  export let label: string;
  export let description: string = "Temp";
  export let icon: IconifyIcon | undefined = undefined;
</script>

<Card type="transparent" extraOptions={{ style: "width: calc(100% - 10px); display: flex; position: relative; padding: 10px; padding-left: 0px; border-radius: 10px; margin: 2px 0px;" }}>
  <div class="content">
    <div class="icon-container">
      {#if icon}
        <Icon icon={icon} height="24px" width="24px" />
      {/if}
    </div>
    <div class="info">
      <div class="font-label">{label}</div>
      <div class="font-body description">
        {description}
      </div>
      <div class="equalizer-container">
        <BandsLabel />
        <div class="bands-container">
          <EqualizerBand band="band32" />
          <BandSpacer />
          <EqualizerBand band="band64" />
          <BandSpacer />
          <EqualizerBand band="band125" />
          <BandSpacer />
          <EqualizerBand band="band250" />
          <BandSpacer />
          <EqualizerBand band="band500" />
          <BandSpacer />
          <EqualizerBand band="band1000" />
          <BandSpacer />
          <EqualizerBand band="band2000" />
          <BandSpacer />
          <EqualizerBand band="band4000" />
          <BandSpacer />
          <EqualizerBand band="band8000" />
          <BandSpacer />
          <EqualizerBand band="band16000" />
        </div>
      </div>
    </div>
  </div>
</Card>

<style>
  .content {
    width: 100%; 
    display: flex;
  }

  .icon-container {
    height: 50px;
    width: 50px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-right: 10px;
  }

  .icon-container :global(svg) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info {
    max-width: 50rem;
  }
  
  .description {
    color: rgb(var(--m3-scheme-outline));
  }

  .equalizer-container {
    max-width: 50rem;
    height: 20rem;
    display: flex;
  }

  .bands-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    gap: 0.25rem;
  }
</style>