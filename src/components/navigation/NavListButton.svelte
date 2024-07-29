<script lang="ts">
  import { Icon } from "@component-utils";
  import type { IconifyIcon } from "@iconify/types";
  import type { HTMLButtonAttributes } from "svelte/elements";

  export let display = "flex";
  export let extraOptions: HTMLButtonAttributes = {};
  export let type: "rail" | "bar";

  export let selected: boolean;
  export let icon: IconifyIcon;
</script>

<button
  on:click
  class="m3-container type-{type}"
  style="display: {display};"
  class:selected
  {...extraOptions}
>
  <div class="icon-space">
    <Icon {icon} />
  </div>
  {#if type === "rail"}
    <p class="m3-font-label-medium font-body-medium">
      <slot />
    </p>
  {/if}
</button>

<style>
  .m3-container {
    flex-direction: column;
    gap: 0.25rem;
    padding: 0;
    border: none;
    text-align: center;

    background-color: transparent;
    --text-color: var(--m3-scheme-on-surface-variant);
    color: rgb(var(--text-color));
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    
    position: relative;
  }
  
  .type-bar {
    height: 2rem;
  }

  .type-rail {
    flex-direction: row;
    align-items: center;
  }

  .m3-container::before {
    position: absolute;
    display: block;
    content: " ";
    background-color: rgb(var(--m3-scheme-secondary-container));
    z-index: 1;

    opacity: 0;
    inset: 0 50%;
    width: 0;
    border-radius: 2rem;
    transition:
      opacity 200ms,
      background-color 200ms,
      inset 0ms 200ms,
      width 0ms 200ms;
  }

  .selected {
    --text-color: var(--m3-scheme-on-surface);
  }
  .m3-container:hover.m3-container::before,
  .selected.m3-container::before {
    opacity: 1;
    inset: 0 0;
    width: 100%;
    transition:
      width 400ms cubic-bezier(0.356, 0.701, 0, 1.004),
      inset 400ms cubic-bezier(0.356, 0.701, 0, 1.004);
  }
  
  
  .m3-container:hover.m3-container::before {
    background-color: rgb(var(--text-color) / 0.08);
  }
  .selected:hover.m3-container::before {
    background-color: rgb(var(--m3-scheme-secondary-container) / 0.9);
  }

  .m3-container:focus-visible.m3-container::before,
  .m3-container:active.m3-container::before {
    background-color: rgb(var(--text-color) / 0.12);
  }
  
  .selected:focus-visible.m3-container::before,
  .selected:active.m3-container::before {
    background-color: rgb(var(--m3-scheme-secondary-container) / 0.9);
  }
  
  p {
    position: relative;
    z-index: 2;
    margin: 0;
    transition: color 200ms;
  }
  
  .icon-space {
    display: flex;
    flex: none;
    align-self: center;
    justify-content: center;
    align-items: center;

    width: 4rem;
    height: 2rem;
  }
  .type-rail > .icon-space {
    width: 3.5rem;
  }
  .icon-space > :global(svg) {
    position: relative;
    z-index: 2;
    width: 1.5rem;
    height: 1.5rem;
    transition: 
      color 200ms;
  }
  .selected > .icon-space > :global(svg) {
    animation: icon-select 0.5s cubic-bezier(0.64, 0.57, 0.67, 1.53);
    color: rgb(var(--m3-scheme-on-secondary-container));
  }

  @keyframes icon-select {
    0% {
      scale: 1
    }
    25% {
      scale: 1.07
    }
    50% {
      scale: 0.93
    }
    75% {
      scale: 1.07
    }
    100% {
      scale: 1
    }
  }
</style>