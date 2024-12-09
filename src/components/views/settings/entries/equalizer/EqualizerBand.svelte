<script lang="ts">
  import { VerticalSlider } from "@interactables";
  import { currentEq, equalizers } from "@stores/State";
  import type { Equalizer } from "@types";

  export let band: keyof Equalizer;
  
  $: equalizer = $equalizers[$currentEq];
  $: value = equalizer[band];
  
  function bandHandler(band: keyof Equalizer) {
    return (event: { detail: any }) => {
      $equalizers[$currentEq][band] = event.detail;
      $equalizers = { ...$equalizers };
    }
  }

  let frequency = band.substring(4);
  let formatted = band.endsWith("000") ? frequency.substring(0, frequency.length - 3) + "k" : frequency;
  let label = `${formatted}`;
</script>

<div class="band">
  <VerticalSlider
    min={-12}
    max={12}
    step={1}
    value={value ?? 0}
    extraWrapperOptions={{
      style: "height: 16rem; margin-top: 1rem"
    }}
    extraOptions={{

    }}
    on:change={bandHandler(band)}
  />
  <div class="label">{label}</div>
</div>

<style>
  .band {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 2.5rem;
  }

  .label {
    font-size: 0.875rem;
    color: rgb(var(--m3-scheme-outline));
  }
</style>