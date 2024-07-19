<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import RadioInput from "./RadioInput.svelte";

  export let name: string;
  export let checked = false;
  export let label: string;

  const dispatch = createEventDispatcher();
  
  /**
   * Relay the input event to the parent.
   */
   function onInput() {
    dispatch("input");
  }
</script>

<button class="item m3-font-label-large" disabled on:click>
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label>
    <RadioInput name={name} checked={checked} on:input={onInput} />
    <div class="radio font-label">{label}</div>
  </label>
</button>

<style>
  .item {
    display: flex;
    align-items: center;
    height: 2.5rem;
    padding: 0 0.75rem;
    white-space: nowrap;

    border: none;
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    transition: all 200ms;
  }

  label {
    display: flex;
    align-items: center;
  }
  
  .radio {
    margin-left: 15px;
  }
</style>