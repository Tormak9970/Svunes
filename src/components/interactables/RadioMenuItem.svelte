<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import RadioInput from "./RadioInput.svelte";

  export let name: string;
  export let checked = false;
  export let label: string;

  const dispatch = createEventDispatcher();
</script>

<button class="item m3-font-label-large" disabled on:click>
  <RadioInput name={name} checked={checked} on:input={() => dispatch("input")} />
  <div class="radio">{label}</div>
</button>

<style>
  .item {
    display: flex;
    align-items: center;
    height: 3rem;
    padding: 0 0.75rem;
    white-space: nowrap;

    border: none;
    background-color: transparent;
    color: rgb(var(--m3-scheme-on-surface));
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    transition: all 200ms;
  }
  
  .radio {
    margin-left: 15px;
    font-size: 16px;
  }
</style>