<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import GenericSnackbar from "./GenericSnackbar.svelte";

  export let extraWrapperOptions: HTMLAttributes<HTMLDivElement> = {};
  export let extraOptions: HTMLAttributes<HTMLDivElement> = {};
  
  export let show: (data: ShowSnackbarOptions) => void;

  const backgroundColor = "var(--m3-scheme-inverse-surface)";
  const textColor = "var(--m3-scheme-inverse-on-surface)";
</script>

<GenericSnackbar extraWrapperOptions={extraWrapperOptions} extraOptions={extraOptions} backgroundColor={backgroundColor} textColor={textColor} bind:show={show} />