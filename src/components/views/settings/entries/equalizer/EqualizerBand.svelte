<script lang="ts">
  import { VerticalSlider } from "@interactables";
  import { currentEq, equalizers } from "@stores/State";
  import type { Equalizer } from "@types";

  export let band: keyof Equalizer;
  
  $: equalizer = $equalizers[$currentEq];
  $: value = equalizer[band];
  
  function bandHandler(band: keyof Equalizer) {
    return (event: { detail: any }) => {
      const eq = $equalizers[$currentEq];
      eq[band] = event.detail;
      eq.gain = -1 * Math.max(0, eq.band32, eq.band64, eq.band125, eq.band250, eq.band500, eq.band1000, eq.band2000, eq.band4000, eq.band8000, eq.band16000);

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